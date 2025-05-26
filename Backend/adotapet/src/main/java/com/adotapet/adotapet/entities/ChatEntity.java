package com.adotapet.adotapet.entities;

import jakarta.persistence.*;

@Entity
public class ChatEntity {

    @Id
    private String id;

    @ManyToOne(optional = false)
    private UserEntity userOwner;

    @ManyToOne(optional = false)
    private UserEntity userAdopt;

    private Boolean isDeletedByAdopter = false;
    private Boolean isDeletedByOwner = false;

    public ChatEntity() {
    }

    public ChatEntity(UserEntity userOwner, UserEntity userAdopt) {
        this.userOwner = userOwner;
        this.userAdopt = userAdopt;
        generateId();
    }

    /**
     * Gera o ID como "menorID_maiorID" antes de persistir ou atualizar.
     */
    @PrePersist
    @PreUpdate
    private void generateId() {
        if (userOwner != null && userAdopt != null) {
            int ownerId = userOwner.getId();
            int adoptId = userAdopt.getId();
            int minId = Math.min(ownerId, adoptId);
            int maxId = Math.max(ownerId, adoptId);
            this.id = minId + "_" + maxId;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserEntity getUserOwner() {
        return userOwner;
    }

    public void setUserOwner(UserEntity userOwner) {
        this.userOwner = userOwner;
    }

    public UserEntity getUserAdopt() {
        return userAdopt;
    }

    public void setUserAdopt(UserEntity userAdopt) {
        this.userAdopt = userAdopt;
    }

    public Boolean getIsDeletedByAdopter() {
        return isDeletedByAdopter;
    }

    public void setIsDeletedByAdopter(Boolean isDeletedByAdopter) {
        this.isDeletedByAdopter = isDeletedByAdopter;
    }

    public Boolean getIsDeletedByOwner() {
        return isDeletedByOwner;
    }

    public void setIsDeletedByOwner(Boolean isDeletedByOwner) {
        this.isDeletedByOwner = isDeletedByOwner;
    }
}
