package com.adotapet.adotapet.entities;

import jakarta.persistence.*;

@Entity
public class ChatEntity {

    @Id
    private String id;

    @ManyToOne
    private UserEntity userOwner;

    @ManyToOne
    private UserEntity userAdopt;

    private Boolean isDeleteByAdopter;
    private Boolean isDeleteByOwner;

    public ChatEntity() {}

    public ChatEntity(UserEntity userOwner, UserEntity userAdopt){
        this.userOwner = userOwner;
        this.userAdopt = userAdopt;
        setId(userOwner, userAdopt);
    }

    public void setId(UserEntity userOwner, UserEntity userAdopt){
        if (userOwner != null && userAdopt != null) {
            this.id = String.valueOf(userOwner.getId()) + String.valueOf(userAdopt.getId());
        }
        throw new RuntimeException("UserOwner or UserAdopt is null");
    }

    public String getId(){
        return id;
    }

    public UserEntity getUserOwner() {
        return userOwner;
    }

    public void setUserOwner(UserEntity userOwner) {
        this.userOwner = userOwner;
        setId(this.userOwner, this.userAdopt);
    }

    public UserEntity getUserAdopt() {
        return userAdopt;
    }

    public void setUserAdopt(UserEntity userAdopt) {
        this.userAdopt = userAdopt;
        setId(this.userOwner, this.userAdopt);
    }
    public Boolean getIsDeletedByAdopter() {
        return isDeleteByAdopter;
    }
    
    
    public void setIsDeletedByAdopter(Boolean isDeleteByAdopter) {
        this.isDeleteByAdopter = isDeleteByAdopter;
    }

    public Boolean getIsDeletedByOwner() {
        return isDeleteByOwner;
    }

    public void setIsDeletedByOwner(Boolean isDeleteByOwner) {
        this.isDeleteByOwner = isDeleteByOwner;
    }
}

