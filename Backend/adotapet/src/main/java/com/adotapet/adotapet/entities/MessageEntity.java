package com.adotapet.adotapet.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;


import com.adotapet.adotapet.entities.UserEntity;


@Entity
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private ChatEntity chat;


    private String text;
    private Integer userSendId;
    private Integer userReceiveId;
    private LocalDateTime dateTime;
    
    MessageEntity(){};

    MessageEntity(UserEntity useSend, UserEntity userReveive, String text) {
        this.userSendId = useSend.getId();
        this.userReceiveId = userReveive.getId();
        this.text = text;
        this.dateTime = LocalDateTime.now();
    }

    public ChatEntity getChat() {
        return chat;
    }
    
    public void setChat(ChatEntity chat) {
        this.chat = chat;
    }
    
    public Long getId() {
        return id;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Integer getUserSendId() {
        return userSendId;
    }
    public void setUserSendId(Integer userSendId) {
        this.userSendId = userSendId;
    }
    public Integer getUserReceiveId() {
        return userReceiveId;
    }
    public void setUserReceiveId(Integer userReceiveId) {
        this.userReceiveId = userReceiveId;
    }
    public LocalDateTime getDateTime() {
        return dateTime;
    }
    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }


    @Override
    public String toString() {
        return "id:" + id + ", userSendId: " + userSendId + ",userReceiveId: " 
        + userReceiveId + ", dateTime: " + dateTime +", text: " + text ;
        }
}
