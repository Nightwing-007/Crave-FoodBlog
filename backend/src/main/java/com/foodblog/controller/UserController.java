package com.foodblog.controller;

import com.foodblog.dto.UserDto;
import com.foodblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PostMapping("/{recipeId}/favorite")
    public ResponseEntity<String> toggleFavorite(@PathVariable Long recipeId) {
        return ResponseEntity.ok(userService.toggleFavorite(recipeId));
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<String> toggleFollow(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.toggleFollow(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfileById(userId));
    }
}
