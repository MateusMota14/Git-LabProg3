package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.repository.DogRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

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

}
