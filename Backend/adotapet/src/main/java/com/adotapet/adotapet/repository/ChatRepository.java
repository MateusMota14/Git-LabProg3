package com.adotapet.adotapet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.ChatEntity;

import org.springframework.data.repository.CrudRepository;




@Repository
public interface ChatRepository extends CrudRepository<ChatEntity, Integer>{

    Optional<ChatEntity> findById(String id);
    List<ChatEntity> findByUserOwner_IdOrUserAdopt_Id(Integer ownerId, Integer adoptId);

}
