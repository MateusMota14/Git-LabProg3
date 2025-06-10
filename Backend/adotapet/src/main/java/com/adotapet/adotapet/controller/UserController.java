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
import org.springframework.web.bind.annotation.PathVariable;

import com.adotapet.adotapet.DTO.Login;
import com.adotapet.adotapet.DTO.PhotoUpdateRequest;
import com.adotapet.adotapet.DTO.PhotoUploadRequest;



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

    @PostMapping("/user/logout/{id}")
    public ApiResponse<UserEntity> login(@PathVariable Integer id) {
        return userService.logOut(id);
    }

    public static class UploadPhotoRequest {
        public Integer userId;
        public String base64Image;
    }

    @PostMapping("/user/upload-photo")
    public ApiResponse<UserEntity> uploadPhoto(@RequestBody UploadPhotoRequest request) {
        try {
            if (request.userId == null || request.base64Image == null) {
                return new ApiResponse<>(null, "Parâmetros obrigatórios faltando");
            }

            UserEntity user = userRepository.findById(request.userId).orElse(null);
            if (user == null) {
                return new ApiResponse<>(null, "Usuário não encontrado");
            }

            byte[] imageBytes = Base64.getDecoder().decode(request.base64Image);
            Path imagePath = Paths.get("src/main/resources/static/Users/" + request.userId + ".jpg");
            Files.write(imagePath, imageBytes);

            user.setImg("Users/" + request.userId + ".jpg");
            userRepository.save(user);

            return new ApiResponse<>(user, "Foto atualizada com sucesso");
        } catch (Exception e) {
            return new ApiResponse<>(null, "Erro ao salvar imagem: " + e.getMessage());
        }
    }




    @PostMapping("/user/update-photo")
    public ApiResponse<UserEntity> updatePhoto(@RequestBody PhotoUpdateRequest req) {
        try {
            UserEntity user = userRepository.findById(req.getUserId()).orElse(null);
            if (user == null) {
                return new ApiResponse<>(null, "Usuário não encontrado");
            }

            Path imagePath = Paths.get("src/main/resources/static/Users/" + req.getUserId() + ".jpg");

            if (Files.exists(imagePath)) {
                Files.delete(imagePath);
            }

            byte[] imageBytes = Base64.getDecoder().decode(req.getBase64Image());
            Files.write(imagePath, imageBytes);

            user.setImg("Users/" + req.getUserId() + ".jpg");
            userRepository.save(user);

            return new ApiResponse<>(user, "Foto atualizada com sucesso");
        } catch (Exception e) {
            return new ApiResponse<>(null, "Erro ao atualizar imagem: " + e.getMessage());
        }
    }



    @DeleteMapping("/user/delete-photo")
    public ApiResponse<UserEntity> detetePhoto(@RequestBody UserEntity user) {
        return userService.deletePhoto(user.getId());
    }

    @GetMapping("/user/dogs")
    public ApiResponse<List<Map<String, Object>>> findDogsByUserId(@RequestParam Integer userId) {
        return dogService.findDogsByUserId(userId);
    }

    @GetMapping("/user/img/{id}")
    public ApiResponse<String> getImage(@PathVariable Integer id  ){
        return userService.getImage(id);
    }

    @GetMapping("/user/city/{city}")
    public ApiResponse<List<UserEntity>> getUsersByCity(@PathVariable String city) {
        return userService.findByCity(city);
    }
}