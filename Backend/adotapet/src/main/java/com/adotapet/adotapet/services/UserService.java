package com.adotapet.adotapet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.DTO.ChangePassword;
import com.adotapet.adotapet.DTO.Login;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private DogRepository dogRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ApiResponse<Iterable<UserEntity>> findAll() {
        Iterable<UserEntity> userAll = userRepository.findAll();
        return new ApiResponse<>("200", userAll);
    }

    public ApiResponse<Iterable<UserEntity>> findByEmail(String email) {
        Iterable<UserEntity> user = userRepository.findByEmail(email);
        if (user.iterator().hasNext()) {
            return new ApiResponse<>("200", user);
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    public ApiResponse<UserEntity> findById(Integer id) {
        Optional<UserEntity> userOptional = userRepository.findById(id); // Retorna um Optional
        if (userOptional.isPresent()) { // Verifica se o usuário existe
            return new ApiResponse<>("200", userOptional.get());
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    public ApiResponse<UserEntity> createUser(UserEntity user) {
        Iterable<UserEntity> userTest = userRepository.findByEmail(user.getEmail());
        if (userTest.iterator().hasNext()) {
            return new ApiResponse<>("User already exists", null);
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        userRepository.save(new UserEntity(user.getName(), user.getEmail(), hashedPassword, user.getCountry(),
                user.getState(), user.getCity(), user.getZCode()));

        return new ApiResponse<>("User created", new UserEntity(user.getName(), user.getEmail(), hashedPassword,
                user.getCountry(), user.getState(), user.getCity(), user.getZCode()));
    }

    public ApiResponse<UserEntity> updateUser(UserEntity user) {
        Optional<UserEntity> userOptional = userRepository.findById(user.getId()); // Retorna um Optional
        if (userOptional.isPresent()) { // Verifica se o usuário existe
            if (passwordEncoder.matches(user.getPassword(), userOptional.get().getPassword())) { // verificação se a
                                                                                                 // senha fornecida
                                                                                                 // confere

                userOptional.get().setName(user.getName());
                userOptional.get().setCountry(user.getCountry());
                userOptional.get().setState(user.getState());
                userOptional.get().setCity(user.getCity());
                userOptional.get().setZCode(user.getZCode());
                userRepository.save(userOptional.get());
                return new ApiResponse<>("User updated", userOptional.get());
            } else
                return new ApiResponse<>("invalid password", null);
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    public ApiResponse<UserEntity> changePassword(ChangePassword change, Integer id) {
        Optional<UserEntity> userOptional = userRepository.findById(id); // Retorna um Optional
        if (userOptional.isPresent()) { // Verifica se o usuário existe
            UserEntity user = userOptional.get(); // Acessa o usuário dentro do Optional
            // Agora passando o objeto 'change' junto com 'user'
            if (this.checkPassword(change, user)) {
                String hashedPassword = passwordEncoder.encode(change.getNewPassword());
                user.setPassword(hashedPassword);
                userRepository.save(user);
                return new ApiResponse<>("Password changed", user);
            }
            return new ApiResponse<>("Invalid password", null);
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    public Boolean checkPassword(ChangePassword change, UserEntity user) {
        return passwordEncoder.matches(change.getOldPassword(), user.getPassword());
    }

    public void generateToken(UserEntity user) {
        user.setAuthToken(UUID.randomUUID().toString());
        user.setAuthTokenExpiration(LocalDateTime.now().plusMinutes(30)); // Define expiração de 30 minutos
    }

    public ApiResponse<UserEntity> login(Login login) {
        Iterable<UserEntity> userTest = userRepository.findByEmail(login.getEmail());
        Iterator<UserEntity> iterator = userTest.iterator();

        if (iterator.hasNext()) {
            UserEntity user = iterator.next();

            if (!passwordEncoder.matches(login.getPassword(), user.getPassword())) {
                return new ApiResponse<>("Password incorrect", null);
            }

            generateToken(user);
            userRepository.save(user);
            return new ApiResponse<>("Login Sucessfull: " + user.getAuthToken(), user);
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    
    public ApiResponse<UserEntity> uploadPhoto(Integer userId, String base64Image) {

        String base64ImageNoPrefix = removerPrefixoBase64(base64Image);
        byte[] imageBytes = Base64.getDecoder().decode(base64ImageNoPrefix);

        // Define o nome do arquivo usando o ID do usuário
        String imageFileName = userId + ".jpg";
        Path destinationFile = Paths.get("src/main/resources/static/Users/", imageFileName);

        try {
            // Salvar a imagem no servidor
            Files.write(destinationFile, imageBytes);

            // Atualizar o caminho da imagem no banco de dados
            UserEntity user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return new ApiResponse<>("User not found", null);
            }

            user.setImg(destinationFile.toString()); // Salvar o caminho da imagem
            userRepository.save(user);

            return new ApiResponse<>("image send", null);
        } catch (IOException e) {
            return new ApiResponse<>("erros to save: " + e.getMessage(), null);
        }
    }

    public ApiResponse<UserEntity> deletePhoto(Integer userId) {
        try {
            // Verifica se o usuário existe
            UserEntity user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return new ApiResponse<>("User not found", null);
            }

            // Obtém o caminho da foto armazenada
            String imgPath = user.getImg();
            if (imgPath == null || imgPath.isEmpty()) {
                return new ApiResponse<>("No image to delete", null);
            }

            Path photoPath = Paths.get(imgPath);

            // Verifica se a foto existe e a exclui
            if (Files.exists(photoPath)) {
                Files.delete(photoPath);
            } else {
                return new ApiResponse<>("Image file not found on server", null);
            }

            // Remove a referência da foto no banco de dados
            user.setImg(null);
            userRepository.save(user);

            return new ApiResponse<>("Image deleted successfully", user);
        } catch (IOException e) {
            return new ApiResponse<>("Error deleting image: " + e.getMessage(), null);
        }
    }

    public String removerPrefixoBase64(String base64ComPrefixo) {
        if (base64ComPrefixo.contains(",")) {
            return base64ComPrefixo.split(",")[1];
        }
        return base64ComPrefixo;
    }


    public ApiResponse<UserEntity> deleteUser(UserEntity user) {
        Optional<UserEntity> userOptional = userRepository.findById(user.getId()); // Retorna um Optional
        if (userOptional.isPresent()) { // Verifica se o usuário existe
            userRepository.delete(user);
            return new ApiResponse<>("User deleted", null);
        } else {
            return new ApiResponse<>("User not found", null);
        }
    }

    public ApiResponse<String> getImage(Integer id) {
        Optional<UserEntity> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return new ApiResponse<>("User not found", null);
        }
    
        String imagePath = userOpt.get().getImg(); // exemplo: ./img/Users/153.jpg
    
        if (imagePath == null || imagePath.isBlank()) {
            return new ApiResponse<>("No image path registered", null);
        }
    
        Path fullPath = Paths.get(imagePath);
    
        if (!Files.exists(fullPath)) {
            return new ApiResponse<>("Image file not found on server", null);
        }
    
        String filename = fullPath.getFileName().toString(); // ex: 153.jpg
        return new ApiResponse<>("OK", "Users/" + filename);
    }

    public ApiResponse<List<UserEntity>> findByCity(String city) {
        List<UserEntity> users = userRepository.findByCityIgnoreCase(city);
        if (users.isEmpty()) {
            return new ApiResponse<>("No users found in this city", null);
        }
        return new ApiResponse<>("200", users);
    }

    public ApiResponse<UserEntity> logOut(Integer id) {
        Optional<UserEntity> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return new ApiResponse<>("User not found", null);
        }

        UserEntity user = userOptional.get();
        String token = user.getAuthToken();
        LocalDateTime expiration = user.getAuthTokenExpiration();

        // Verifica se há token e se não expirou
        if (token == null || expiration == null || expiration.isBefore(LocalDateTime.now())) {
            return new ApiResponse<>("Invalid or expired auth token", null);
        }

        // Token válido: realiza logout
        user.setAuthToken(null);
        user.setAuthTokenExpiration(null);
        userRepository.save(user);

        return new ApiResponse<>("User logged out", user);
    }
    
}
