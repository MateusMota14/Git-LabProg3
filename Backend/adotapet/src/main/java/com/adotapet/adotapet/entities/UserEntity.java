package com.adotapet.adotapet.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    public UserEntity(String name, String email, String password, String country, String state, String city,
            String zCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.country = country;
        this.state = state;
        this.city = city;
        this.zCode = zCode;
    }

    public UserEntity() {
    } // para o JPA

    // public UserEntity(String email, String password) {
    //     this.email = email;
    //     this.password = password;
    // }

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getzCode() {
        return zCode;
    }

    public void setzCode(String zCode) {
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

    @Override
    public String toString() {
        return "UserEntity [id: " + id + ", name: " + name + ", email: " + email + ", country: " + country + ", state: "
                + state + ", city: " + city + ", zCode: " + zCode + ", authToken" + authToken
                + ", authTokenExpiration: " + authTokenExpiration + "]";
    }
}
