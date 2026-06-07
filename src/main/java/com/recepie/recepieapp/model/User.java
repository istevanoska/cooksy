package com.recepie.recepieapp.model;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Table(name = "\"user\"")
public class User {

    @Id
    private Long id;

    private String username;
    private String email;
    @Getter
    private String password;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}