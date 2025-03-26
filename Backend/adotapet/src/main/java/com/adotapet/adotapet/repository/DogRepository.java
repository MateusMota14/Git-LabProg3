package com.adotapet.adotapet.repository;

import java.util.Optional;
import java.util.List;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.DogEntity;


@Repository
public interface DogRepository extends CrudRepository<DogEntity, Integer> {

    Optional<DogEntity> findById(Integer id);
    List<DogEntity> findByUserId(Integer id);
}