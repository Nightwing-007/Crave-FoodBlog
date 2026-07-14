package com.foodblog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {
    private Long id;
    private String title;
    private String instructions;
    private String category;
    private String imageUrl;
    private Integer cookingTime;
    private LocalDateTime createdAt;
    private Long creatorId;
    private String creatorName;
    private List<String> ingredients;
    private int favoriteCount;
    private String difficulty;
    private List<String> tags;
}
