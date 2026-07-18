package magesh.ems.backend.repository;

import magesh.ems.backend.entity.Employee;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Data-access layer for {@link Employee} rows. Everything below is a
 * Spring Data JPA <em>derived query method</em> — the implementation is
 * generated at startup from the method name, using bind parameters under
 * the hood (never string concatenation), so it's not a SQL-injection
 * surface no matter what a caller passes in.
 */
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    /**
     * Roster search used by {@code GET /api/employees?q=...}. Matches a
     * substring case-insensitively against first name, last name, or
     * email — a record matches if any one of the three contains it.
     * {@link magesh.ems.backend.service.EmployeeServiceImpl} is
     * responsible for trimming/length-capping {@code term} and for only
     * ever passing a {@link Sort} built from its own allow-listed field
     * map, never a raw client-supplied string.
     */
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email, Sort sort);
}
