package com.adotapet.adotapet.entities;

import java.util.ArrayList;
import java.util.List;

import com.adotapet.adotapet.entities.UserEntity;

import jakarta.persistence.*;

@Entity
public class DogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private String breed;
    private String age;
    private String size;
    private String gender;

    @ElementCollection
    @CollectionTable(name = "dog_photos", joinColumns = @JoinColumn(name = "dog_id"))
    @Column(name = "url_photo")
    private List<String> urlPhotos = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY)
    private List<UserEntity> userLike = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY)
    private List<UserEntity> userMatch = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    public DogEntity() {
    }

    public DogEntity(String name, String breed, String age, String size, String gender, UserEntity user) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.size = size;
        this.user = user;
        this.gender = gender;
        this.urlPhotos = new ArrayList<>();
        this.userLike = new ArrayList<>();
        this.userMatch = new ArrayList<>();
    }

    public void addUrlPhoto(String photo){
        this.urlPhotos.add(photo);
    }

    public void addUserLike(UserEntity user){
        this.userLike.add(user);
    }

    public void addUserMatch(UserEntity user){
        this.userMatch.add(user);
    }

    public List<String> getUrlPhotos() {
        return urlPhotos;
    }

    public List<UserEntity> getUserLike() {
        return userLike;
    }

    public List<UserEntity> getUserMatch() { // Corrigido nome do método
        return userMatch;
    }

    public void setUrlPhotos(List<String> urlPhotos) {
        this.urlPhotos = urlPhotos;
    }

    public void setUserMatch(List<UserEntity> userMatch) {
        this.userMatch = userMatch;
    }

    public void setUserLike(List<UserEntity> userLike) {
        this.userLike = userLike;
    }
    
    public void removeUrlPhoto(String photo) {
        if (urlPhotos != null) {
            urlPhotos.remove(photo);
        }
    }
    
    public void removeUserMatch(UserEntity user) {
        if (userMatch != null) {
            userMatch.removeIf(u -> u.getId().equals(user.getId()));
        }
    }
    
    public void removeUserLike(UserEntity user) {
        if (userLike != null) {
            userLike.removeIf(u -> u.getId().equals(user.getId()));
        }
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    @Override
    public String toString() {
        return "DogEntity [id=" + id + ", name=" + name + ", breed=" + breed + ", age=" + age + ", size=" + size + ",gender=" + gender
                + ", user=" + user +"]";
    }
}
