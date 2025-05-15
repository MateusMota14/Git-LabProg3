package com.adotapet.adotapet.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.adotapet.adotapet.entities.MessageEntity;
import com.adotapet.adotapet.entities.ChatEntity;

@Repository
public interface MessageRepository extends CrudRepository<MessageEntity, Long> {
    List<MessageEntity> findByChat(ChatEntity chat);
}

