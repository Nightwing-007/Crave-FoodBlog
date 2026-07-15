package com.foodblog.service;

import com.foodblog.dto.RecipeDto;
import com.foodblog.entity.Recipe;
import com.foodblog.entity.User;
import com.foodblog.exception.ResourceNotFoundException;
import com.foodblog.repository.RecipeRepository;
import com.foodblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import com.foodblog.entity.Difficulty;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<RecipeDto> getAllRecipes(String search, String category, Difficulty difficulty, String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        String finalCategory = (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) ? category.toLowerCase() : null;
        String finalSearch = (search != null && !search.isEmpty()) ? search.toLowerCase() : null;
        String finalTag = (tag != null && !tag.isEmpty()) ? tag.toLowerCase() : null;

        Page<Recipe> recipes = recipeRepository.findRecipesWithFilters(finalSearch, finalCategory, difficulty, finalTag, pageable);
        return recipes.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        return mapToDto(recipe);
    }

    public RecipeDto createRecipe(RecipeDto recipeDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).get();

        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDto.getTitle());
        // Sanitize incoming HTML instructions
        String safeInstructions = Jsoup.clean(recipeDto.getInstructions(), Safelist.relaxed());
        recipe.setInstructions(safeInstructions);
        recipe.setCategory(recipeDto.getCategory());
        recipe.setImageUrl(recipeDto.getImageUrl() != null ? recipeDto.getImageUrl() : "https://via.placeholder.com/150");
        recipe.setCookingTime(recipeDto.getCookingTime());
        recipe.setIngredients(recipeDto.getIngredients());
        if (recipeDto.getDifficulty() != null) {
            recipe.setDifficulty(Difficulty.valueOf(recipeDto.getDifficulty()));
        }
        recipe.setTags(recipeDto.getTags());
        recipe.setCreator(user);

        Recipe savedRecipe = recipeRepository.save(recipe);
        return mapToDto(savedRecipe);
    }

    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).get();

        if (!recipe.getCreator().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this recipe");
        }

        recipeRepository.delete(recipe);
    }

    public RecipeDto mapToDto(Recipe recipe) {
        return RecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .instructions(recipe.getInstructions())
                .category(recipe.getCategory())
                .imageUrl(recipe.getImageUrl())
                .cookingTime(recipe.getCookingTime())
                .createdAt(recipe.getCreatedAt())
                .creatorId(recipe.getCreator().getId())
                .creatorName(recipe.getCreator().getName())
                .ingredients(recipe.getIngredients())
                .difficulty(recipe.getDifficulty() != null ? recipe.getDifficulty().name() : null)
                .tags(recipe.getTags())
                .reviewCount(recipe.getReviews() != null ? recipe.getReviews().size() : 0)
                .averageRating(recipe.getReviews() != null && !recipe.getReviews().isEmpty() ? 
                        recipe.getReviews().stream().mapToInt(com.foodblog.entity.Review::getRating).average().orElse(0.0) : 0.0)
                .build();
    }
}
