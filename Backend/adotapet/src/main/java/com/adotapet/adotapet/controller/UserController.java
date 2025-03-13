package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.UserRepository;
import com.adotapet.adotapet.services.UserService;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam; //remover
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;





@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    private UserService userService;

    @PostConstruct
    public void init(){
        
        userService = new UserService(userRepository);
    }



    @GetMapping("/user/all")
    public Iterable<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
    
    @GetMapping("/user/email")
    public ApiResponse<Iterable<UserEntity>> getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @GetMapping("/user/id")
    public ApiResponse<UserEntity> getUserById(@RequestParam Integer id) {
        return userService.findById(id);
    }
    
    @PostMapping("/user/create")
    public ApiResponse<UserEntity> createUser(@RequestBody UserEntity user) {
                
        return userService.createUser(user);
    }

    @DeleteMapping("/user/delete")
    public ApiResponse<UserEntity> deleteUser(@RequestBody UserEntity user) {
        return userService.deleteUser(user);
        }

    @PostMapping ("/user/update")
    public ApiResponse<UserEntity> updateUser(@RequestBody UserEntity user) {
        return userService.updateUser(user);
        }
    
}