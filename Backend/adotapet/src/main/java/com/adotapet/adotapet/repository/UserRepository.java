package com.adotapet.adotapet.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.UserEntity;
// import java.util.Optional;
import java.util.List;


@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {

    Iterable<UserEntity> findByEmail(String email);
    UserEntity findByEmailAndPassword(String email, String password);
    List<UserEntity> findByCityIgnoreCase(String city); //list?
}
