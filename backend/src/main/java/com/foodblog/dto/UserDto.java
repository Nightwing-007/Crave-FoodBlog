package com.foodblog.dto;

import com.foodblog.enums.Role;
import lombok.Data;
import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Set<RecipeDto> favoriteRecipes;
    private Set<RecipeDto> createdRecipes;
    private int followerCount;
    private int followingCount;
    private boolean isFollowedByCurrentUser;
}
