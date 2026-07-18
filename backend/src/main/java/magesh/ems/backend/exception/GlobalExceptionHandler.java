package magesh.ems.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Central error handling for the whole API.
 *
 * This is the main "code exposure prevention" control on the backend: it
 * guarantees stack traces, exception class names, SQL text, and file paths
 * never reach an HTTP response body, no matter where in the call stack a
 * failure happens. Pair with server.error.include-stacktrace=never in
 * application.properties, which locks down Spring's own fallback /error
 * page the same way.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /** Employee id didn't exist → 404, with the (safe) message from {@link ResourceNotFoundException}. */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /** A unique-constraint or other DB-level integrity rule was violated (currently: duplicate email) → 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex, WebRequest request) {
        // Deliberately not ex.getMessage(): on most JDBC drivers that string
        // contains the raw SQL and constraint name, which is exactly the
        // kind of internal detail this handler exists to keep out.
        return build(HttpStatus.CONFLICT, "An employee with this email already exists.");
    }

    /**
     * Catch-all for anything not handled above — a DB connection drop, a
     * NullPointerException, whatever. Logs the real exception (with stack
     * trace) server-side for debugging, but the client only ever sees a
     * generic 500 message. This is the backstop that guarantees internal
     * failure details can never leak through the API, no matter what kind
     * of bug causes them.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpected(Exception ex, WebRequest request) {
        logger.error("Unhandled exception while processing " + request.getDescription(false), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
    }

    /**
     * Overrides the framework's default handling for
     * {@code @Valid}-triggered {@link MethodArgumentNotValidException} (a
     * {@code @NotBlank}/{@code @Email}/{@code @Size} failure on {@link
     * magesh.ems.backend.dto.EmployeeDto}) so the response is a flat,
     * frontend-friendly {@code field -> message} map instead of Spring's
     * default verbose error structure.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                    HttpHeaders headers,
                                                                    HttpStatusCode status,
                                                                    WebRequest request) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField,
                        fe -> fe.getDefaultMessage() == null ? "Invalid value" : fe.getDefaultMessage(),
                        (a, b) -> a, LinkedHashMap::new));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation failed");
        body.put("fields", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    /** Shared shape for every error response this handler produces: timestamp, status, reason phrase, message. */
    private ResponseEntity<Object> build(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
