package com.recepie.recepieapp.controller;

import com.recepie.recepieapp.dto.LoginRequest;
import com.recepie.recepieapp.model.User;
import com.recepie.recepieapp.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request){

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();

        if(!user.getPassword().equals(request.getPassword())){
            throw new RuntimeException("Wrong password");
        }

        return user;
    }
}