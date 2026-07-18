package magesh.ems.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import magesh.ems.backend.dto.EmployeeDto;
import magesh.ems.backend.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Note: no @CrossOrigin("*") here anymore -- allowed origins are now
// configured centrally in WebConfig, driven by app.cors.allowed-origins,
// instead of trusting every website's JavaScript by default.
/**
 * HTTP entry point for employee CRUD — thin by design: every method just
 * validates the request shape ({@code @Valid}), delegates to {@link
 * EmployeeService} for the actual logic, and maps the result to a status code.
 * Anything that goes wrong past this point (not-found, duplicate email, an
 * unexpected failure) is caught by {@link
 * magesh.ems.backend.exception.GlobalExceptionHandler}, not here.
 *
 * There is currently no authentication/authorization on these endpoints — every
 * route below is reachable by anyone who can reach the API and pass the
 * CORS/origin check. See the README's Security &amp; Hardening section.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * {@code POST /api/employees} - create a new employee. 201 + the created
     * record (with its new id) on success.
     */
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto employeeDto) {
        EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    /**
     * {@code GET /api/employees/{id}} - fetch one employee by id. 404 (via
     * GlobalExceptionHandler) if it doesn't exist.
     */
    @GetMapping("{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long employeeId) {
        EmployeeDto employeeDto = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employeeDto);
    }

    /**
     * {@code GET /api/employees[?q=&sortBy=&sortDir=]} - list employees,
     * optionally filtered by a free-text search and sorted. All three params
     * are optional; with none supplied this returns the full roster sorted by
     * first name ascending. Returns an empty array, never null, when nothing
     * matches.
     */
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "sortBy", required = false, defaultValue = "firstname") String sortBy,
            @RequestParam(name = "sortDir", required = false, defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(employeeService.getAllEmployee(query, sortBy, sortDir));
    }

    /**
     * {@code PUT /api/employees/{id}} - replace an existing employee's fields.
     * 404 if the id doesn't exist.
     */
    @PutMapping("{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") Long employeeId,
            @Valid @RequestBody EmployeeDto updatedEmployee) {
        return ResponseEntity.ok(employeeService.updateEmployee(employeeId, updatedEmployee));
    }

    /**
     * {@code DELETE /api/employees/{id}} - remove an employee. 204 with no body
     * on success, 404 if the id doesn't exist.
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable("id") Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }
}
