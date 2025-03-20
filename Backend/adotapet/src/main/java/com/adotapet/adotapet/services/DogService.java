package com.adotapet.adotapet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.repository.UserRepository;

@Service
public class DogService {

    @Autowired
    private DogRepository dogRepository;
    private UserRepository userRepository;

    public DogService(DogRepository dogRepository, UserRepository userRepository) {
        this.dogRepository = dogRepository;
        this.userRepository = userRepository;
    }

    public ApiResponse<Iterable<DogEntity>> findAll() {
        Iterable<DogEntity> dogAll = dogRepository.findAll();
        return new ApiResponse<>("200", dogAll);
    }

    public ApiResponse<DogEntity> createDog(DogEntity dog, Integer userId) {
        // Verifica se o usuário existe
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ApiResponse<>("User not found", null);
        }

        // Associa o usuário ao cachorro
        dog.setUser(userOptional.get());

        // Salva o cachorro no banco de dados
        DogEntity savedDog = dogRepository.save(dog);
        return new ApiResponse<>("Dog created", savedDog);
    }

    public ApiResponse<DogEntity> deleteDog(DogEntity dog) {
        Optional<DogEntity> dogOptional = dogRepository.findById(dog.getId()); // Retorna um Optional
        if (dogOptional.isPresent()) { // Verifica se o usuário existe
            dogRepository.delete(dog);
            return new ApiResponse<>("Dog deleted", null);
        } else {
            return new ApiResponse<>("Dog not found", null);
        }
    }

    public ApiResponse<List<Map<String, Object>>> findDogsByUserId(Integer userId) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ApiResponse<>("User not found", null);
        }

        // Obtém os cachorros do usuário
        List<DogEntity> dogs = dogRepository.findByUserId(userId);

        // Transforma a lista para retornar apenas os dados necessários
        List<Map<String, Object>> result = dogs.stream()
                .map(dog -> {
                    Map<String, Object> dogMap = new LinkedHashMap<>(); // para aparecer na ordem solicitada
                    dogMap.put("id", dog.getId());
                    dogMap.put("name", dog.getName());
                    dogMap.put("breed", dog.getBreed());
                    dogMap.put("age", dog.getAge());
                    dogMap.put("gender", dog.getGender());
                    return dogMap;
                })
                .collect(Collectors.toList());

        return new ApiResponse<>("Id Usuario: " + userId, result);
    }

    public ApiResponse<DogEntity> updateDog(DogEntity dog) {
        Optional<DogEntity> dogOptional = dogRepository.findById(dog.getId());
        Optional<UserEntity> userOptional = userRepository.findById(dog.getUser().getId());

        if (dogOptional.isPresent()) {

            if (userOptional.isPresent()) {
                DogEntity updateDog = dogOptional.get();
                updateDog.setName(dog.getName());
                updateDog.setAge(dog.getAge());


                dogRepository.save(updateDog);
                return new ApiResponse<>("Dog updated", dog);

            } else {
                return new ApiResponse<>("User this dog not found", null);
            }
        } else {
            return new ApiResponse<>("Dog not found", null);
        }
    }

}
