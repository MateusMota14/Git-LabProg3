// package com.adotapet.adotapet.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import java.nio.file.Paths;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Override
//     public void addResourceHandlers(ResourceHandlerRegistry registry) {
//         // Caminho físico onde estão as imagens
//         String imagePath = Paths.get("./img/Users/").toAbsolutePath().toUri().toString();

//         registry.addResourceHandler("/Users/**") // URL pública
//                 .addResourceLocations(imagePath); // Caminho físico no disco
//     }
// }

package com.adotapet.adotapet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}

