package cit.ojtnsync.caps.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/upload") // Adjust the mapping to your endpoint
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("POST", "OPTIONS")  // Include OPTIONS method
                .allowedMethods("POST")
                .allowedHeaders("*");
    }
}
