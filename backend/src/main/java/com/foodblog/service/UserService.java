package com.foodblog.service;

import com.foodblog.dto.RecipeDto;
import com.foodblog.dto.UserDto;
import com.foodblog.entity.Recipe;
import com.foodblog.entity.User;
import com.foodblog.exception.ResourceNotFoundException;
import com.foodblog.repository.RecipeRepository;
import com.foodblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeService recipeService;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Prevent admin from deleting themselves
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getEmail().equals(currentEmail)) {
            throw new RuntimeException("Cannot delete your own admin account");
        }

        userRepository.delete(user);
    }

    public UserDto getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToDto(user);
    }

    @Transactional
    public String toggleFavorite(Long recipeId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).get();
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));

        if (user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().remove(recipe);
            userRepository.save(user);
            return "Recipe removed from favorites";
        } else {
            user.getFavoriteRecipes().add(recipe);
            userRepository.save(user);
            return "Recipe added to favorites";
        }
    }

    @Transactional
    public String toggleFollow(Long targetUserId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email).get();

        if (currentUser.getId().equals(targetUserId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getFollowing().contains(targetUser)) {
            currentUser.getFollowing().remove(targetUser);
            userRepository.save(currentUser);
            return "Unfollowed user";
        } else {
            currentUser.getFollowing().add(targetUser);
            userRepository.save(currentUser);
            return "Followed user";
        }
    }

    public UserDto getUserProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        userDto.setFavoriteRecipes(user.getFavoriteRecipes().stream()
                .map(recipeService::mapToDto).collect(Collectors.toSet()));
        userDto.setCreatedRecipes(user.getCreatedRecipes().stream()
                .map(recipeService::mapToDto).collect(Collectors.toSet()));
        
        userDto.setFollowerCount(user.getFollowers() != null ? user.getFollowers().size() : 0);
        userDto.setFollowingCount(user.getFollowing() != null ? user.getFollowing().size() : 0);
        
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            if (currentUserEmail != null && !currentUserEmail.equals("anonymousUser")) {
                userRepository.findByEmail(currentUserEmail).ifPresent(currentUser -> {
                    userDto.setFollowedByCurrentUser(user.getFollowers() != null && user.getFollowers().contains(currentUser));
                });
            }
        } catch (Exception e) {
            // Ignore if no auth context
        }
        
        return userDto;
    }
}
