package magesh.ems.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Replaces the old @CrossOrigin("*") on the controller. A wildcard origin meant
 * any website's JavaScript could call this API using a signed-in user's browser
 * session (a classic CSRF-via-CORS misconfiguration). Origins are now an
 * explicit allow-list, driven by app.cors.allowed-origins so each environment
 * (dev/staging/prod) can pin its own frontend URL(s) without a code change.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
