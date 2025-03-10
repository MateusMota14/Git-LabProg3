package com.adotapet.adotapet.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class DogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private String breed;
    private String age;
    private String size;

    @ElementCollection
    @CollectionTable(name = "dog_images", joinColumns = @JoinColumn(name = "dog_id"))
    @Column(name = "url")
    private List<String> urlImg = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    public DogEntity() {
    }

    public DogEntity(String name, String breed, String age, String size, UserEntity user) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.size = size;
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<String> getUrlImg() {
        return urlImg;
    }

    public void addUrlImg(String url) {
        this.urlImg.add(url);
    }

    public void setUrlImg(List<String> urls) {
        this.urlImg = urls;
    }

    @Override
    public String toString() {
        return "DogEntity [id=" + id + ", name=" + name + ", breed=" + breed + ", age=" + age + ", size=" + size
                + ", user=" + user + ", urlImg=" + urlImg + "]";
    }
}
