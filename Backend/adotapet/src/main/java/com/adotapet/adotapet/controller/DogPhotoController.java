package com.adotapet.adotapet.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogPhotoEntity;
import com.adotapet.adotapet.repository.DogPhotoRepository;
import com.adotapet.adotapet.services.DogPhotoService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class DogPhotoController {

    // @Autowired
    // private DogPhotoRepository dogPhotoRepository;

    @Autowired
    private DogPhotoService dogPhotoService;

    @PostMapping("/dog/upload-photo")
    public ApiResponse<DogPhotoEntity> uploadDogFoto(@RequestBody Map<String, String> payload) {
        String base64Image = payload.get("photoBase64");
        Integer dogId = Integer.parseInt(payload.get("id"));

        return dogPhotoService.uploadDogPhoto(dogId, base64Image);
    }

    @DeleteMapping("/dog/delete-photo")
    public ApiResponse<DogPhotoEntity> deleteDogPhoto(@RequestBody DogPhotoEntity dogPhotoEntity) {
        return dogPhotoService.deleteDogPhoto(dogPhotoEntity);
    }

    // para teste
    @GetMapping("/dog/all-photos")
    public ApiResponse<List<Map<String, Object>>> getAllPhotosByDogId(@RequestParam Integer dogId) {
        return dogPhotoService.findAllByDogId(dogId);
    }

    

}
