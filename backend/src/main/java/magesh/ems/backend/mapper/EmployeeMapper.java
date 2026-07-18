package magesh.ems.backend.mapper;

import magesh.ems.backend.dto.EmployeeDto;
import magesh.ems.backend.entity.Employee;

/**
 * Stateless conversion between the JPA {@link Employee} entity and the
 * public-facing {@link EmployeeDto}. Kept as static methods on a
 * non-instantiable class (no Spring bean, no per-call allocation) since the
 * mapping is a pure, side-effect-free field copy in both directions.
 */
public final class EmployeeMapper {

    private EmployeeMapper() {
        // utility class - not meant to be instantiated
    }

    /**
     * Entity → DTO, for read paths (list/get) and after a create/update
     * save, so the controller only ever hands the client the public shape.
     */
    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        return new EmployeeDto(employee.getId(), employee.getFirstName(), employee.getLastName(), employee.getEmail());
    }

    /**
     * DTO → entity, for turning a validated inbound request body into
     * something {@link magesh.ems.backend.repository.EmployeeRepository}
     * can persist.
     */
    public static Employee mapToEmployee(EmployeeDto employeeDto) {
        return new Employee(employeeDto.getId(), employeeDto.getFirstname(), employeeDto.getLastname(), employeeDto.getEmail());
    }
}
