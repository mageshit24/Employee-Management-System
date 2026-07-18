package magesh.ems.backend.service;

import magesh.ems.backend.dto.EmployeeDto;
import magesh.ems.backend.entity.Employee;

import java.util.List;

/**
 * Business logic for employee CRUD, sitting between {@link
 * magesh.ems.backend.controller.EmployeeController} (HTTP concerns) and
 * {@link magesh.ems.backend.repository.EmployeeRepository} (persistence).
 * Defined as an interface so the controller depends on a contract rather
 * than {@link EmployeeServiceImpl} directly — useful for testing (a mock
 * implementation) even though there's only one real implementation today.
 */
public interface EmployeeService {

    /** Persists a new employee and returns it with its generated id. */
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    /** Looks up one employee by id; throws {@link magesh.ems.backend.exception.ResourceNotFoundException} if absent. */
    EmployeeDto getEmployeeById(Long employeeId);

    /**
     * Returns employees on file, optionally filtered and sorted for the
     * roster screen's search box and sort control.
     *
     * @param query   free-text search term matched against first name,
     *                last name, and email (case-insensitive substring);
     *                {@code null} or blank returns every employee
     * @param sortBy  one of {@code firstname}, {@code lastname},
     *                {@code email}, {@code id} (case-insensitive);
     *                anything else falls back to {@code firstname} —
     *                this is an allow-list, not a passthrough, so it's
     *                never used to build a query from an arbitrary
     *                client-supplied field name
     * @param sortDir {@code asc} or {@code desc} (case-insensitive);
     *                anything else falls back to {@code asc}
     */
    List<EmployeeDto> getAllEmployee(String query, String sortBy, String sortDir);

    /** Overwrites an existing employee's fields; throws if the id doesn't exist. */
    EmployeeDto updateEmployee(Long employeeId, EmployeeDto updateEmployee);

    /** Removes an employee by id; throws if the id doesn't exist. */
    void deleteEmployee(long employeeId);
}
