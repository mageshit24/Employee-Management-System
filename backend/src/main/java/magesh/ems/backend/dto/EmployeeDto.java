package magesh.ems.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The shape of an employee as it crosses the REST boundary — every
 * controller method reads/writes this type, never the JPA {@link
 * magesh.ems.backend.entity.Employee} entity directly. Keeping the two
 * separate means the database schema (entity) can change independently of
 * the public API contract (this class), and lets us attach Bean Validation
 * rules here without polluting the entity.
 *
 * The {@code @NotBlank}/{@code @Email}/{@code @Size} annotations are
 * enforced automatically on any controller parameter annotated
 * {@code @Valid} (see {@link magesh.ems.backend.controller.EmployeeController});
 * a failing request never reaches the service layer and instead gets a
 * 400 response built by {@link magesh.ems.backend.exception.GlobalExceptionHandler}.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {

    /** Database-generated primary key. Ignored on create; required on update/delete paths. */
    private long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be 50 characters or fewer")
    private String firstname;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be 50 characters or fewer")
    private String lastname;

    // @Email only checks basic address shape (it does not verify the
    // mailbox exists) - paired with a matching unique constraint on the
    // Employee entity's column so duplicate addresses are rejected too.
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid address")
    @Size(max = 100, message = "Email must be 100 characters or fewer")
    private String email;
}
