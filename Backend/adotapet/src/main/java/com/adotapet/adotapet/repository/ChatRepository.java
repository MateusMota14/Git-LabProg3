package com.adotapet.adotapet.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.ChatEntity;

import org.springframework.data.repository.CrudRepository;




@Repository
public interface ChatRepository extends CrudRepository<ChatEntity, Integer>{

    Optional<ChatEntity> findById(String id);

}
