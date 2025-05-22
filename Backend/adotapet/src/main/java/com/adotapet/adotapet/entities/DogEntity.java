package com.adotapet.adotapet.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import jakarta.persistence.*;

/**
 * Entidade Dog armazenando apenas coleções de IDs para likes e matches.
 */
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
    @CollectionTable(
        name = "dog_photos",
        joinColumns = @JoinColumn(name = "dog_id")
    )
    @Column(name = "url_photo")
    private List<String> urlPhotos = new ArrayList<>();

    /** IDs de usuários que deram like neste dog */
    @ElementCollection
    @CollectionTable(
        name = "dog_entity_user_like",
        joinColumns = @JoinColumn(name = "dog_entity_id")
    )
    @Column(name = "user_like_id")
    private Set<Integer> userLike = new HashSet<>();

    /** IDs de usuários que deram match neste dog */
    @ElementCollection
    @CollectionTable(
        name = "dog_entity_user_match",
        joinColumns = @JoinColumn(name = "dog_entity_id")
    )
    @Column(name = "user_match_id")
    private Set<Integer> userMatch = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    public DogEntity() {}

    public DogEntity(String name, String breed, String age, String size, String gender, UserEntity user) {
        this.name   = name;
        this.breed  = breed;
        this.age    = age;
        this.size   = size;
        this.gender = gender;
        this.user   = user;
    }

    // — Getters e Setters de campos base —

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

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public List<String> getUrlPhotos() {
        return urlPhotos;
    }
    public void setUrlPhotos(List<String> urlPhotos) {
        this.urlPhotos = urlPhotos;
    }

    public void addUrlPhoto(String photo) {
    this.urlPhotos.add(photo);
}
public void removeUrlPhoto(String photo) {
    this.urlPhotos.remove(photo);
}

    public UserEntity getUser() {
        return user;
    }
    public void setUser(UserEntity user) {
        this.user = user;
    }

    // — Métodos de gerenciamento de likes (IDs) —

    public Set<Integer> getUserLike() {
        return userLike;
    }
    public void setUserLike(Set<Integer> userLike) {
        this.userLike = userLike;
    }
    public void addUserLike(Integer userId) {
        this.userLike.add(userId);
    }
    public void removeUserLike(Integer userId) {
        this.userLike.remove(userId);
    }

    // — Métodos de gerenciamento de matches (IDs) —

    public Set<Integer> getUserMatch() {
        return userMatch;
    }
    public void setUserMatch(Set<Integer> userMatch) {
        this.userMatch = userMatch;
    }
    public void addUserMatch(Integer userId) {
        this.userMatch.add(userId);
    }
    public void removeUserMatch(Integer userId) {
        this.userMatch.remove(userId);
    }

    // — equals/hashCode baseado apenas em id —

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DogEntity)) return false;
        DogEntity that = (DogEntity) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "DogEntity [id=" + id + ", name=" + name + ", breed=" + breed + "]";
    }
}
