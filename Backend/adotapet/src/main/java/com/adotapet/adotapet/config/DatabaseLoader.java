package com.adotapet.adotapet.config;

import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.UserEntity;
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

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DatabaseLoader {

    @Bean
    public ApplicationRunner initDatabase(
            UserRepository userRepository,
            DogRepository dogRepository
    ) {
        return args -> {
            ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                // caso use “zcode” no JSON ou qualquer outra propriedade case‑insensitive
                .configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // 1) popula usuários se estiver vazio
            if (userRepository.count() == 0) {
                ClassPathResource usersRes = new ClassPathResource("users.json");
                try (InputStream is = usersRes.getInputStream()) {
                    List<UserEntity> users = mapper.readValue(
                        is,
                        new TypeReference<List<UserEntity>>() {}
                    );
                    userRepository.saveAll(users);
                    System.out.println(">>> Usuários carregados: " + users.size());
                }
            }

            // 2) popula dogs se estiver vazio
            if (dogRepository.count() == 0) {
                ClassPathResource dogsRes = new ClassPathResource("dogs.json");
                try (InputStream is = dogsRes.getInputStream()) {
                    // lê lista de DTOs genéricos (que cascateiam para DogEntity)
                    List<DogEntity> dogs = mapper.readValue(
                        is,
                        new TypeReference<List<DogEntity>>() {}
                    );

                    // vincula cada DogEntity ao seu UserEntity e associações
                    for (DogEntity dog : dogs) {
                        // usuário “dono” do dog
                        Integer ownerId = dog.getUser().getId();
                        UserEntity owner = userRepository.findById(ownerId)
                                .orElseThrow(() -> new IllegalStateException(
                                    "Usuário não encontrado: " + ownerId));
                        dog.setUser(owner);
                    }

                    dogRepository.saveAll(dogs);
                    System.out.println(">>> Dogs carregados: " + dogs.size());
                }
            }
        };
    }
}
