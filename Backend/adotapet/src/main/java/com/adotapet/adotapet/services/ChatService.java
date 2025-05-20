package com.adotapet.adotapet.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;


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

    public ApiResponse<List<ChatEntity>> findChatsByUserId(Integer userId) {
        // verifica existência do usuário
        if (userRepository.findById(userId).isEmpty()) {
            return new ApiResponse<>("User not found", null);
        }

        // busca todos os chats onde ele é owner ou adopter
        List<ChatEntity> chats =
            chatRepository.findByUserOwner_IdOrUserAdopt_Id(userId, userId);

        if (chats.isEmpty()) {
            return new ApiResponse<>("No chats for user " + userId, Collections.emptyList());
        }
        return new ApiResponse<>("Chats found for user " + userId, chats);
    }

    public ApiResponse<List<Map<String, Object>>> readMessages(ChatEntity chat) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
        if (chatOptional.isEmpty()) {
            return new ApiResponse<>("Chat not found", null);
        }
        ChatEntity chatEntity = chatOptional.get();

        List<MessageEntity> messages = messageRepository.findByChat(chatEntity);
        List<Map<String, Object>> result = messages.stream()
                .map(msg -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("chatId", chatEntity.getId());
                    m.put("messageId", msg.getId());
                    m.put("senderId", msg.getUserSendId());
                    m.put("receiverId", msg.getUserReceiveId());
                    m.put("text", msg.getText());
                    m.put("timestamp", msg.getDateTime());
                    return m;
                })
                .collect(Collectors.toList());

        return new ApiResponse<>("Messages found for chat " + chatEntity.getId(), result);
    }

    public ApiResponse<ChatEntity> findById(String id) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(id);
        if (chatOptional.isPresent()) {
            return new ApiResponse<>("Chat", chatOptional.get());
        }
        return new ApiResponse<>("Chat not found", null);
    }

    // public ApiResponse<ChatEntity> createChat(UserEntity userOwner, UserEntity
    // userAdopter) {
    // Optional<UserEntity> userOwnerOptional =
    // userRepository.findById(userOwner.getId());
    // Optional<UserEntity> userAdopterOptional =
    // userRepository.findById(userAdopter.getId());

    // if (userOwnerOptional.isPresent() && userAdopterOptional.isPresent()) {

    // ChatEntity chat = new ChatEntity(userOwner, userAdopter);
    // chatRepository.save(chat);
    // return new ApiResponse<>("Chat created", chat);
    // }
    // return new ApiResponse<>("User not found", null);
    // }

    public ApiResponse<ChatEntity> createChat(UserEntity userOwner, UserEntity userAdopter) {
        Optional<UserEntity> ownerOpt = userRepository.findById(userOwner.getId());
        Optional<UserEntity> adopterOpt = userRepository.findById(userAdopter.getId());

        if (ownerOpt.isEmpty() || adopterOpt.isEmpty()) {
            return new ApiResponse<>("User not found", null);
        }

        UserEntity owner = ownerOpt.get();
        UserEntity adopter = adopterOpt.get();
        String chatId = owner.getId() + "_" + adopter.getId();

        // se já existir, retorna sem criar
        Optional<ChatEntity> existing = chatRepository.findById(chatId);
        if (existing.isPresent()) {
            return new ApiResponse<>("Chat already exists", existing.get());
        }

        // cria novo chat
        ChatEntity chat = new ChatEntity(owner, adopter);
        chatRepository.save(chat);
        return new ApiResponse<>("Chat created", chat);
    }

    public ApiResponse<ChatEntity> deleteByOwner(ChatEntity chat, UserEntity userOwner) {
        Optional<ChatEntity> chatOptional = chatRepository.findById(chat.getId());
        if (chatOptional.isPresent()) {
            Optional<UserEntity> userOwnerOptional = userRepository.findById(userOwner.getId());
            if (userOwnerOptional.isPresent()) {
                ChatEntity chatEntity = chatOptional.get();
                if (!chatEntity.getIsDeletedByOwner()) {
                    chatEntity.setIsDeletedByOwner(true);
                    chatRepository.save(chatEntity);
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
                    chatRepository.save(chatEntity);
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
