package magesh.ems.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Minimal smoke test: boots the full Spring application context (all
 * beans, JPA, the security/CORS config) and fails if anything throws
 * during startup — e.g. a missing bean, a broken @Configuration class, or
 * (with a real DB configured) a bad datasource property. Intentionally has
 * no assertions of its own; a clean run is the assertion.
 */
@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
