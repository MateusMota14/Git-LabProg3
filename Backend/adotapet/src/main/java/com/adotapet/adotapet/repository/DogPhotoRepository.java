package com.adotapet.adotapet.repository;

import org.springframework.data.repository.CrudRepository;

import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.DogEntity;
import com.adotapet.adotapet.entities.DogPhotoEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface DogPhotoRepository extends CrudRepository <DogPhotoEntity, Integer> {

    Optional<DogPhotoEntity> findById(Integer id);
    List<DogPhotoEntity> findByDogId(Integer dogId);
    List<DogPhotoEntity> findByDog(DogEntity dog);
}
