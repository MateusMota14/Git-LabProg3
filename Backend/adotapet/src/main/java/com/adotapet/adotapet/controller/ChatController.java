package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.ChatEntity;
import com.adotapet.adotapet.entities.MessageEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.services.ChatService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * Cria um novo chat entre dois usuários (criado automaticamente, não é
     * necessário esse endpoint)
     */
    @PostMapping
    public ApiResponse<ChatEntity> createChat(@RequestBody ChatEntity chatEntity)
    {
    UserEntity owner = chatEntity.getUserOwner();
    UserEntity adopter = chatEntity.getUserAdopt();
    return chatService.createChat(owner, adopter);
    }

    /**
     * Retorna os detalhes de um chat pelo ID
     */
    @GetMapping("/{chatId}")
    public ApiResponse<ChatEntity> getChat(@PathVariable String chatId) {
        return chatService.findById(chatId);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ChatEntity>> getChatsByUser(@PathVariable Integer userId) {
        return chatService.findChatsByUserId(userId);
    }

    /**
     * Retorna todas as mensagens de um chat
     */
    @GetMapping("/{chatId}/messages")
    public ApiResponse<List<Map<String, Object>>> getMessages(@PathVariable String chatId) {
        ApiResponse<ChatEntity> chatResp = chatService.findById(chatId);
        if (chatResp.getData() != null) {
            return chatService.readMessages(chatResp.getData());
        }
        return new ApiResponse<>("Chat not found", null);
    }

    /**
     * Marca um chat como excluído pelo proprietário ou exclui de vez se ambos
     * excluíram
     */
    @DeleteMapping("/{chatId}/owner/{ownerId}")
    public ApiResponse<ChatEntity> deleteByOwner(@PathVariable String chatId,
            @PathVariable Integer ownerId) {
        ApiResponse<ChatEntity> chatResp = chatService.findById(chatId);
        if (chatResp.getData() != null) {
            UserEntity owner = new UserEntity();
            owner.setId(ownerId);
            return chatService.deleteByOwner(chatResp.getData(), owner);
        }
        return chatResp;
    }

    /**
     * Marca um chat como excluído pelo adotante ou exclui de vez se ambos excluíram
     */
    @DeleteMapping("/{chatId}/adopter/{adopterId}")
    public ApiResponse<ChatEntity> deleteByAdopter(@PathVariable String chatId,
            @PathVariable Integer adopterId) {
        ApiResponse<ChatEntity> chatResp = chatService.findById(chatId);
        if (chatResp.getData() != null) {
            UserEntity adopter = new UserEntity();
            adopter.setId(adopterId);
            return chatService.deleteByAdopter(chatResp.getData(), adopter);
        }
        return chatResp;
    }
}
