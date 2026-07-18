package magesh.ems.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Employee Management System backend.
 *
 * {@code @SpringBootApplication} triggers component scanning (picking up
 * every {@code @Component}/{@code @Service}/{@code @RestController}/
 * {@code @Configuration} under this package, including
 * {@link magesh.ems.backend.config.WebConfig} and
 * {@link magesh.ems.backend.config.SecurityHeadersFilter}) plus Spring
 * Boot's autoconfiguration, which is what wires up the embedded Tomcat
 * server, the JPA/Hibernate stack, and virtual-thread request handling
 * (enabled via {@code spring.threads.virtual.enabled} in
 * application.properties).
 */
@SpringBootApplication
public class BackendApplication {

	/**
	 * Boots the Spring application context and starts the embedded web
	 * server. This is the single process entry point run by
	 * {@code ./mvnw spring-boot:run} or the packaged jar.
	 *
	 * @param args standard Java command-line arguments, forwarded to Spring
	 *             Boot (e.g. {@code --server.port=9090} to override a
	 *             property without editing application.properties)
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
