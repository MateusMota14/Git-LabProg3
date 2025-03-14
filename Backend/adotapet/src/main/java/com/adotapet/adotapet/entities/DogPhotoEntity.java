package com.adotapet.adotapet.entities;

import jakarta.persistence.*;



@Entity
public class DogPhotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String imgUrl;

    @ManyToOne
    @JoinColumn(name = "dog_id", nullable = false)
    private DogEntity dog;

    public DogPhotoEntity() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public DogEntity getDog() {
        return dog;
    }

    public void setDog(DogEntity dog) {
        this.dog = dog;
    }

}
