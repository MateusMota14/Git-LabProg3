package com.adotapet.adotapet.DTO;

public class UploadPhotoRequest {
    private Integer userId;
    private String base64Image;

    // Getters e setters
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getBase64Image() {
        return base64Image;
    }
    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }
}

