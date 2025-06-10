package com.adotapet.adotapet.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

/**
 * Entidade User armazenando apenas coleções de IDs para matches com dogs.
 */
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String password;
    private String country;
    private String state;
    private String city;
    private String zCode;

    private String img;
    private String authToken;
    private LocalDateTime authTokenExpiration;

    /**
     * IDs de dogs que deram match com este usuário
     */
    @ElementCollection
    @CollectionTable(name = "dog_entity_user_match", joinColumns = @JoinColumn(name = "user_match_id"))
    @Column(name = "dog_entity_id")
    private Set<Integer> userMatch = new HashSet<>();

    public UserEntity() {
    }

    public UserEntity(String name, String email, String password,
        String country, String state, String city, String zCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.country = country;
        this.state = state;
        this.city = city;
        this.zCode = zCode;
    }

    // — Getters e setters básicos —
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZCode() {
        return zCode;
    }

    public void setZCode(String zCode) {
        this.zCode = zCode;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public LocalDateTime getAuthTokenExpiration() {
        return authTokenExpiration;
    }

    public void setAuthTokenExpiration(LocalDateTime authTokenExpiration) {
        this.authTokenExpiration = authTokenExpiration;
    }

    // — Métodos de gerenciamento de matches (IDs de dogs) —
    public Set<Integer> getUserMatch() {
        return userMatch;
    }

    public void setUserMatch(Set<Integer> userMatch) {
        this.userMatch = userMatch;
    }

    public void addUserMatch(Integer dogId) {
        this.userMatch.add(dogId);
    }

    public void removeUserMatch(Integer dogId) {
        this.userMatch.remove(dogId);
    }

    // — equals/hashCode baseado apenas em id —
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof UserEntity))
            return false;
        UserEntity that = (UserEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "UserEntity [id=" + id + ", name=" + name + "]";
    }
}
