package magesh.ems.backend.service;

import lombok.RequiredArgsConstructor;
import magesh.ems.backend.dto.EmployeeDto;
import magesh.ems.backend.entity.Employee;
import magesh.ems.backend.exception.ResourceNotFoundException;
import magesh.ems.backend.mapper.EmployeeMapper;
import magesh.ems.backend.repository.EmployeeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Default {@link EmployeeService} implementation. Every public method runs
 * inside a transaction (class-level {@code @Transactional}); read-only
 * paths additionally mark {@code @Transactional(readOnly = true)} so
 * Hibernate can skip dirty-checking and the DB driver can apply read-only
 * optimisations where supported.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    // Constructor injection via Lombok's @RequiredArgsConstructor (all
    // final fields become constructor params) - preferred over field
    // injection because it makes the dependency explicit and immutable,
    // and lets this class be constructed directly in a unit test.
    private final EmployeeRepository employeeRepository;

    // Allow-list mapping the public API's sort key (DTO-style, lowercase)
    // to the actual JPA entity field it's permitted to sort by. Building
    // a Sort straight from a client-supplied string would let a caller
    // probe for (or crash the request on) entity field/property names
    // that were never meant to be exposed; going through this map means
    // an unrecognised value just falls back to "firstname" instead.
    private static final Map<String, String> SORTABLE_FIELDS = Map.of(
            "firstname", "firstName",
            "lastname", "lastName",
            "email", "email",
            "id", "id"
    );

    // Search terms are capped rather than rejected outright - a very long
    // "q" can't do anything harmful against a parameterized LIKE query,
    // but capping keeps the query itself, and any logging of it, bounded.
    private static final int MAX_QUERY_LENGTH = 100;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee createdEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(createdEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee does not exist with given id: " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployee(String query, String sortBy, String sortDir) {
        String entityField = SORTABLE_FIELDS.getOrDefault(
                sortBy == null ? "" : sortBy.trim().toLowerCase(), "firstName");
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, entityField);

        String term = query == null ? "" : query.trim();
        if (term.length() > MAX_QUERY_LENGTH) {
            term = term.substring(0, MAX_QUERY_LENGTH);
        }

        // .toList() (Java 16+) instead of .collect(Collectors.toList()) -
        // fewer allocations, and the result is properly immutable.
        List<Employee> employees = term.isEmpty()
                ? employeeRepository.findAll(sort)
                : employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        term, term, term, sort);

        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .toList();
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updateEmployee) {
        // Load-then-mutate-then-save (rather than mapping a brand new
        // entity straight from the DTO) keeps this a true partial update
        // of a managed entity, so Hibernate's dirty-checking only writes
        // columns that actually changed.
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee does not exist with given id: " + employeeId));

        employee.setFirstName(updateEmployee.getFirstname());
        employee.setLastName(updateEmployee.getLastname());
        employee.setEmail(updateEmployee.getEmail());

        Employee updatedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(long employeeId) {
        // existsById is a cheap existence check (no entity hydration) versus
        // the previous findById().orElseThrow() just to validate the id.
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee does not exist with given id: " + employeeId);
        }
        employeeRepository.deleteById(employeeId);
    }
}
