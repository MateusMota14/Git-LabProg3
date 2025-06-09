package com.adotapet.adotapet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.List;
import java.util.Set;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.DogPhotoEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.DogPhotoRepository;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class DogService {

    @Autowired
    private DogRepository dogRepository;
    private UserRepository userRepository;
    @Autowired
    private DogPhotoRepository dogPhotoRepository;

    @Autowired
    private DogPhotoService dogPhotoService;

    @Autowired
    private ChatService chatService;

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
        //System.out.println("Usuário associado ao cachorro: " + dog.getUser().getId());

        // Salva o cachorro no banco de dados
        DogEntity savedDog = dogRepository.save(dog);
        return new ApiResponse<>("Dog created", savedDog);
    }

    @Transactional
    public ApiResponse<DogEntity> deleteDog(DogEntity dogServ) {
        Optional<DogEntity> dogOptional = dogRepository.findById(dogServ.getId());

        if (dogOptional.isPresent()) {
            DogEntity dog = dogOptional.get();

            // 1. Buscar todas as fotos associadas
            List<DogPhotoEntity> dogPhotos = dogPhotoRepository.findByDog(dog);

            // 2. Para cada foto, remover o arquivo e a entidade
            for (DogPhotoEntity photo : dogPhotos) {
                dogPhotoService.deleteDogPhoto(photo);
            }

            // 3. Agora sim, deletar o Dog
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

    public ApiResponse<DogEntity> updateDog(DogEntity dog, Integer userId) {
    Optional<DogEntity> dogOptional = dogRepository.findById(dog.getId());
    if (dogOptional.isEmpty()) {
        return new ApiResponse<>("Dog not found", null);
    }

    Optional<UserEntity> userOptional = userRepository.findById(userId);
    if (userOptional.isEmpty()) {
        return new ApiResponse<>("User not found", null);
    }

    DogEntity updateDog = dogOptional.get();
    updateDog.setName(dog.getName());
    updateDog.setAge(dog.getAge());
    updateDog.setUrlPhotos(dog.getUrlPhotos());
    updateDog.setUser(userOptional.get());  // associa o usuário aqui

    dogRepository.save(updateDog);
    return new ApiResponse<>("Dog updated", updateDog);
}



    @Transactional
    public ApiResponse<Set<Integer>> addUserLike(Integer userId, Integer dogId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        DogEntity dog = dogRepository.findById(dogId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dog not found"));

        if (!dog.getUserLike().contains(userId)) {
            dog.addUserLike(userId);
            dogRepository.save(dog);
        }
        return new ApiResponse<>("UserLike add", dog.getUserLike());
    }

    @Transactional
    public ApiResponse<Set<Integer>> addUserMatch(Integer userId, Integer dogId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        DogEntity dog = dogRepository.findById(dogId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dog not found"));

        if (!dog.getUserLike().contains(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot match: user has not liked this dog");
        }
        //dog.removeUserLike(userId);
        dog.addUserMatch(userId);
        dogRepository.save(dog);

        user.addUserMatch(dogId);
        userRepository.save(user);

        return new ApiResponse<>("UserMatch add", dog.getUserMatch());
    }

public ApiResponse <DogEntity> findById(Integer id) {
    Optional<DogEntity> dogOptional = dogRepository.findById(id); // Retorna um Optional
    if (dogOptional.isPresent()) { // Verifica se o dog existe
        return new ApiResponse<>("200", dogOptional.get());
    } else {
        return new ApiResponse<>("Dog not found", null);
    }
    }

    public ApiResponse<String> getDogImage(Integer id) {
        Optional<DogEntity> dogOpt = dogRepository.findById(id);
        if (dogOpt.isEmpty()) {
            return new ApiResponse<>("Dog not found", null);
        }
    
        List<String> photos = dogOpt.get().getUrlPhotos();
    
        if (photos == null || photos.isEmpty()) {
            return new ApiResponse<>("No photos registered for this dog", null);
        }
    
        String imagePath = photos.get(0); // pega a primeira imagem
    
        Path fullPath = Paths.get(imagePath);
    
        if (!Files.exists(fullPath)) {
            return new ApiResponse<>("Image file not found on server", null);
        }
    
        // Extraímos o nome do arquivo para montar o caminho relativo
        String filename = fullPath.getFileName().toString();
    
        // Monta o caminho do tipo Dogs/{id}/{foto.jpg}
        return new ApiResponse<>("OK", "Dogs/" + id + "/" + filename);
    }

    public ApiResponse<List<DogEntity>> findDogsByOwnerCity(String city) {
        List<DogEntity> dogs = dogRepository.findByUser_CityIgnoreCase(city);
        if (dogs.isEmpty()) {
            return new ApiResponse<>("No dogs found for users in this city", null);
        }
        return new ApiResponse<>("200", dogs);
    }
    
}
