package com.adotapet.adotapet.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.UserRepository;

@Service
public class UserService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //verificar funcionalidade (funciona com json)
    public ApiResponse<Iterable<UserEntity>> findAll(){
        Iterable<UserEntity> userAll = userRepository.findAll();
        return new ApiResponse<>("200", userAll);
    }
}
