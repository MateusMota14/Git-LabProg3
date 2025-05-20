package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.entities.UserEntity;


import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

    @PostMapping("/dog/userlike")
    public ApiResponse <List<UserEntity>> addUserLike(@RequestBody UserEntity userLike, @RequestParam Integer dogId){
        return dogService.addUserLike(userLike, dogId);
    }

    @PostMapping("/dog/match")
    public ApiResponse <List<UserEntity>> addUserMatch(@RequestBody UserEntity userLike,@RequestParam Integer dogId){
        return dogService.addUserMatch(userLike, dogId);
    }

    @GetMapping("/dog/id")
    public ApiResponse<DogEntity> findById(@RequestParam Integer id) {
        return dogService.findById(id);
    }

    @GetMapping("/dog/img/{id}")
    public ApiResponse<String> getDogImage(@PathVariable Integer id  ){
        return dogService.getDogImage(id);
    }

    @GetMapping("/dog/city/{city}")
    public ApiResponse<List<DogEntity>> getDogsByOwnerCity(@PathVariable String city) {
        return dogService.findDogsByOwnerCity(city);
    }

}
