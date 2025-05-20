package com.adotapet.adotapet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.entities.MessageEntity;
import com.adotapet.adotapet.services.MessageService;


@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     Envia uma nova mensagem
     O JSON de requisição deve incluir pelo menos:
     {
     "chat": { "id": "uuid-do-chat" },
     "userSendId": 1,
     "text": "Olá, tudo bem?"
     }
     */
    @PostMapping
    public ApiResponse<MessageEntity> sendMessage(@RequestBody MessageEntity message) {
        String chatId = message.getChat().getId();
        Integer senderId = message.getUserSendId();
        String text = message.getText();
        return messageService.sendMessage(chatId, senderId, text);
    }

    /**
     * Busca uma mensagem pelo ID.
     */
    @GetMapping("/{messageId}")
    public ApiResponse<MessageEntity> getMessageById(@PathVariable Long messageId) {
        return messageService.findById(messageId);
    }
}
