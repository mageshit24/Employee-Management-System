package magesh.ems.backend.exception;

/**
 * Thrown by {@link magesh.ems.backend.service.EmployeeServiceImpl} when a
 * lookup, update, or delete targets an employee id that doesn't exist.
 * Caught centrally by {@link GlobalExceptionHandler#handleNotFound} and
 * turned into a 404 response — the message passed here is safe to return
 * to the client as-is (it's just "no employee with id N"), unlike most
 * other exception messages in this codebase.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
