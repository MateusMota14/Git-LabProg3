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

