package com.adotapet.adotapet.controller;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.DTO.ChangePassword;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.UserRepository;
import com.adotapet.adotapet.services.DogService;
import com.adotapet.adotapet.services.UserService;

import jakarta.annotation.PostConstruct;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam; //remover
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.adotapet.adotapet.DTO.Login;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    private UserService userService;

    @Autowired
    private DogService dogService;

    @PostConstruct
    public void init() {

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

    @PostMapping("/user/update")
    public ApiResponse<UserEntity> updateUser(@RequestBody UserEntity user) {
        return userService.updateUser(user);
    }

    @PostMapping("/user/changepassword")
    public ApiResponse<UserEntity> changePassword(@RequestBody ChangePassword change, @RequestParam Integer id) {
        return userService.changePassword(change, id);
    }

    @PostMapping("/user/login")
    public ApiResponse<UserEntity> login(@RequestBody Login login) {
        return userService.login(login);
    }

    @PostMapping("/user/upload-photo")
    public ApiResponse<UserEntity> uploadFotoBase64(@RequestBody Map<String, String> payload) {
        String base64Image = payload.get("photoBase64");
        Integer userId = Integer.parseInt(payload.get("id"));

        return userService.uploadPhoto(userId, base64Image);
    }

    @DeleteMapping("/user/delete-photo")
    public ApiResponse<UserEntity> detetePhoto(@RequestBody UserEntity user) {
        return userService.deletePhoto(user.getId());
    }

    @GetMapping("/user/dogs")
    public ApiResponse<List<Map<String, Object>>> findDogsByUserId(@RequestParam Integer userId) {
        return dogService.findDogsByUserId(userId);
    }

}