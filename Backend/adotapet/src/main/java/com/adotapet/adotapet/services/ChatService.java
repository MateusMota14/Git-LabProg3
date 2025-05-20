package com.adotapet.adotapet.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.ChatEntity;
import com.adotapet.adotapet.entities.MessageEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.repository.ChatRepository;
import com.adotapet.adotapet.repository.MessageRepository;
import com.adotapet.adotapet.repository.UserRepository;

@Service
public class ChatService {

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    UserRepository userRepository;
    @Autowired
    MessageRepository messageRepository;

    public ApiResponse<List<MessageEntity>> readMessages(ChatEntity chat) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
        if (chatOptional.isPresent()) {
            List<MessageEntity> messages = messageRepository.findByChat(chatOptional.get());
            return new ApiResponse<>("Messages found", messages);
        }
        return new ApiResponse<>("Chat not found", null);
    }

    public ApiResponse<ChatEntity> findById(String id) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(id);
        if (chatOptional.isPresent()) {
            return new ApiResponse<>("Chat", chatOptional.get());
        }
        return new ApiResponse<>("Chat not found", null);
    }

    public ApiResponse<ChatEntity> createChat(UserEntity userOwner, UserEntity userAdopter) {
        Optional<UserEntity> userOwnerOptional = userRepository.findById(userOwner.getId());
        Optional<UserEntity> userAdopterOptional = userRepository.findById(userAdopter.getId());

        if (userOwnerOptional.isPresent() && userAdopterOptional.isPresent()) {

            ChatEntity chat = new ChatEntity(userOwner, userAdopter);
            chatRepository.save(chat);
            return new ApiResponse<>("Chat created", chat);
        }
        return new ApiResponse<>("User not found", null);
    }

    public ApiResponse<ChatEntity> deleteByOwner(ChatEntity chat, UserEntity userOwner) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
        if (chatOptional.isPresent()) {
            Optional<UserEntity> userOwnerOptional = userRepository.findById(userOwner.getId());
            if (userOwnerOptional.isPresent()) {
                ChatEntity chatEntity = chatOptional.get();
                if (!chatEntity.getIsDeletedByOwner()) {
                    chatEntity.setIsDeletedByOwner(true);
                }
                if (chatEntity.getIsDeletedByOwner() == true && chatEntity.getIsDeletedByAdopter() == true) {
                    chatRepository.delete(chatEntity);
                    return new ApiResponse<>("Chat deleted", null);
                } else {
                    return new ApiResponse<>("Chat not deleted, only deleted by owner", null);
                }
            }
            return new ApiResponse<>("User not found", null);
        }
        return new ApiResponse<>("Chat not found", null);
    }

    public ApiResponse<ChatEntity> deleteByAdopter(ChatEntity chat, UserEntity userAdopter) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
        if (chatOptional.isPresent()) {
            Optional<UserEntity> userAdopterOptional = userRepository.findById(userAdopter.getId());
            if (userAdopterOptional.isPresent()) {
                ChatEntity chatEntity = chatOptional.get();

                if (!chatEntity.getIsDeletedByAdopter()) {
                    chatEntity.setIsDeletedByAdopter(true);
                }

                if (chatEntity.getIsDeletedByOwner() == true && chatEntity.getIsDeletedByAdopter() == true) {
                    chatRepository.delete(chatEntity);
                    return new ApiResponse<>("Chat deleted", null);
                } else {
                    return new ApiResponse<>("Chat not deleted, only deleted by adopter", null);
                }
            }
            return new ApiResponse<>("User not found", null);
        }
        return new ApiResponse<>("Chat not found", null);
    }

    // public ApiResponse<MessageEntity> readMessages(ChatEntity chat){
    // Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
    // if(chatOptional.isPresent()){
    // ChatEntity chatEntity = chatOptional.get();
    // String messageId = chatEntity.getUserOwner().getId() +
    // chatEntity.getUserAdopter().getId();
    // (...)
    // }

}
