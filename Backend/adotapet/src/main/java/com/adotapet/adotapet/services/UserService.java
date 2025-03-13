package com.adotapet.adotapet.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.DTO.ChangePassword;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.UserRepository;

@Service
public class UserService {


    private UserRepository userRepository;
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
                user.getState(), user.getCity(), user.getzCode()));

        return new ApiResponse<>("User created", new UserEntity(user.getName(), user.getEmail(), hashedPassword,
                user.getCountry(), user.getState(), user.getCity(), user.getzCode()));
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

    public ApiResponse<UserEntity> updateUser(UserEntity user) {
        Optional<UserEntity> userOptional = userRepository.findById(user.getId()); // Retorna um Optional
        if (userOptional.isPresent()) { // Verifica se o usuário existe
            if (passwordEncoder.matches(user.getPassword(), userOptional.get().getPassword())) { //verificação se a senha fornecida confere

                userOptional.get().setName(user.getName());
                userOptional.get().setCountry(user.getCountry());
                userOptional.get().setState(user.getState());
                userOptional.get().setCity(user.getCity());
                userOptional.get().setzCode(user.getzCode());
                userRepository.save(userOptional.get());
                return new ApiResponse<>("User updated", userOptional.get());
            }
            else
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

}
