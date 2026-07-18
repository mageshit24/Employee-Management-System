package magesh.ems.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA entity mapped to the {@code employees} table — the persistence-layer
 * model, as opposed to {@link magesh.ems.backend.dto.EmployeeDto} which is
 * what the REST API actually exposes. {@link magesh.ems.backend.mapper.EmployeeMapper}
 * converts between the two so a change on one side (e.g. renaming a
 * database column) doesn't automatically ripple into the public API shape,
 * and vice versa.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

    // IDENTITY delegates PK generation to the database's auto-increment
    // column rather than a separate sequence/table - simplest strategy for
    // MySQL and matches the existing "employees" schema.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    // Column-level constraint is a second line of defence behind the DTO's
    // @Email/@NotBlank checks -- it holds even if a row is ever written
    // through a path that skips bean validation (a migration, a console, etc).
    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;
}
