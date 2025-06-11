package com.adotapet.adotapet.DTO;

import com.adotapet.adotapet.entities.DogEntity;

public class DogCreateRequest {
    private DogEntity dog;
    private Integer userId;

    public DogEntity getDog() {
        return dog;
    }

    public void setDog(DogEntity dog) {
        this.dog = dog;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}

