package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.entities.UserEntity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.MediaType;

import com.adotapet.adotapet.services.DogService;

@RestController
public class DogController {

    @Autowired
    private DogRepository dogRepository;

    @Autowired
    private DogService dogService;

    @GetMapping("/dog/all")
    public Iterable<DogEntity> getAllDogs() {
        return dogRepository.findAll();
    }

    @PostMapping("/dog/create")
    public ApiResponse<DogEntity> createUser(@RequestBody DogEntity dog) {

        return dogService.createDog(dog, dog.getUser().getId());
    }

    @DeleteMapping("/dog/delete")
    public ApiResponse<DogEntity> deleteDog(@RequestBody DogEntity dog) {
        return dogService.deleteDog(dog);
    }

    @PostMapping("/dog/update")
    public ApiResponse<DogEntity> updateDog(@RequestBody DogEntity dog) {
        return dogService.updateDog(dog);
    }

    @PostMapping("/dog/userlike/{userLikeId}/{dogId}")
    public ApiResponse<Set<Integer>> addUserLike(
         @PathVariable Integer userLikeId,
         @PathVariable Integer dogId) {
            return dogService.addUserLike(userLikeId, dogId);
    }

    @PostMapping("/dog/usermatch/{userMatchId}/{dogId}")
    public ApiResponse<Set<Integer>> addUserMatch(
         @PathVariable Integer userMatchId,
         @PathVariable Integer dogId) {
            return dogService.addUserMatch(userMatchId, dogId);
    }

    @GetMapping("/dog/id")
    public ApiResponse<DogEntity> findById(@RequestParam Integer id) {
        return dogService.findById(id);
    }

    @GetMapping(value = "/dog/img/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<ByteArrayResource> serveDogImage(@PathVariable Integer id) throws IOException {
        DogEntity dog = dogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Dog não encontrado"));

        // Pega só a primeira foto registrada:
        String rawPath = dog.getUrlPhotos().get(0)
            .replace("\\", "/")
            .replace("src/main/resources/static/", "");
        Path file = Paths.get("src/main/resources/static", rawPath);

        byte[] data = Files.readAllBytes(file);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"")
            .contentType(MediaType.IMAGE_JPEG)
            .body(resource);
    }

    @GetMapping("/dog/city/{city}")
    public ApiResponse<List<DogEntity>> getDogsByOwnerCity(@PathVariable String city) {
        return dogService.findDogsByOwnerCity(city);
    }

}
