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
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Envia uma mensagem em um chat existente.
     */
    public ApiResponse<MessageEntity> sendMessage(String chatId, Integer senderId, String text) {
        Optional<ChatEntity> chatOpt = chatRepository.findById(chatId);
        if (!chatOpt.isPresent()) {
            return new ApiResponse<>("Chat not found", null);
        }
        ChatEntity chat = chatOpt.get();

        Optional<UserEntity> senderOpt = userRepository.findById(senderId);
        if (!senderOpt.isPresent()) {
            return new ApiResponse<>("Sender not found", null);
        }
        UserEntity sender = senderOpt.get();

        // Verifica se o remetente faz parte do chat
        if (!chat.getUserOwner().getId().equals(senderId) 
                && !chat.getUserAdopt().getId().equals(senderId)) {
            return new ApiResponse<>("User not part of chat", null);
        }

        // Determina o destinatário
        UserEntity receiver = chat.getUserOwner().getId().equals(senderId)
                ? chat.getUserAdopt()
                : chat.getUserOwner();

        // Cria a mensagem usando o construtor de MessageEntity
        MessageEntity message = new MessageEntity(sender, receiver, text);
        message.setChat(chat);

        MessageEntity saved = messageRepository.save(message);
        return new ApiResponse<>("Message sent successfully", saved);
    }

    /**
     * Recupera todas as mensagens de um chat.
     */
    public ApiResponse<List<MessageEntity>> getMessagesByChat(String chatId) {
        Optional<ChatEntity> chatOpt = chatRepository.findById(chatId);
        if (!chatOpt.isPresent()) {
            return new ApiResponse<>("Chat not found", null);
        }
        List<MessageEntity> messages = messageRepository.findByChat(chatOpt.get());
        return new ApiResponse<>("Messages retrieved successfully", messages);
    }

    /**
     * Busca uma mensagem pelo ID.
     */
    public ApiResponse<MessageEntity> findById(Long messageId) {
        Optional<MessageEntity> msgOpt = messageRepository.findById(messageId);
        if (!msgOpt.isPresent()) {
            return new ApiResponse<>("Message not found", null);
        }
        return new ApiResponse<>("Message found", msgOpt.get());
    }
}
