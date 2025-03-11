package com.adotapet.adotapet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
    
    public ApiResponse<Iterable<DogEntity>> findAll(){
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

    


}
