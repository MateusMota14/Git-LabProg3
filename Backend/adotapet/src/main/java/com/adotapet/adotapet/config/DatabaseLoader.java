package com.adotapet.adotapet.config;

import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.DogPhotoEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.DogPhotoRepository;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DatabaseLoader {

    @Bean
    ApplicationRunner init(
        UserRepository userRepository,
        DogRepository dogRepository,
        DogPhotoRepository dogPhotoRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // 1) popula usuários
            if (userRepository.count() == 0) {
                ClassPathResource usersRes = new ClassPathResource("users.json");
                try (InputStream is = usersRes.getInputStream()) {
                    List<UserEntity> users = mapper.readValue(is, new TypeReference<List<UserEntity>>() {});
                    users.forEach(u -> u.setPassword(passwordEncoder.encode(u.getPassword())));
                    userRepository.saveAll(users);
                    System.out.println(">>> Usuários carregados: " + users.size());
                }
            }

            // 2) popula cães
            if (dogRepository.count() == 0) {
                ClassPathResource dogsRes = new ClassPathResource("dogs.json");
                try (InputStream is = dogsRes.getInputStream()) {
                    List<DogEntity> dogs = mapper.readValue(is, new TypeReference<List<DogEntity>>() {});
                    // vincula o owner correto
                    dogs.forEach(dog -> {
                        Integer ownerId = dog.getUser().getId();
                        UserEntity owner = userRepository.findById(ownerId)
                            .orElseThrow(() -> new IllegalStateException("Usuário não encontrado: " + ownerId));
                        dog.setUser(owner);
                    });
                    dogRepository.saveAll(dogs);
                    System.out.println(">>> Dogs carregados: " + dogs.size());
                }
            }

            // 3) popula fotos de cães (somente ímpares, 2 fotos cada)
            if (dogPhotoRepository.count() == 0) {
                Iterable<DogEntity> allDogs = dogRepository.findAll();
                List<DogPhotoEntity> photos = new ArrayList<>();
                for (DogEntity dog : allDogs) {
                    int dogId = dog.getId();
                    if (dogId % 2 == 1) {
                        for (int j = 0; j < 2; j++) {
                            int photoId = dogId + j;
                            DogPhotoEntity photo = new DogPhotoEntity();
                            photo.setImgUrl(
                                "src/main/resources/static/dogs/" +
                                dogId + "/" +
                                photoId + ".jpg"
                            );
                            photo.setDog(dog);
                            photos.add(photo);
                        }
                    }
                }
                dogPhotoRepository.saveAll(photos);
                System.out.println(">>> Dog photos carregadas: " + photos.size());
            }
        };
    }
}
