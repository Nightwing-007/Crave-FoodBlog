package com.foodblog.controller;

import com.foodblog.dto.RecipeDto;
import com.foodblog.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private com.foodblog.service.ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getAllRecipes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) com.foodblog.entity.Difficulty difficulty,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(recipeService.getAllRecipes(search, category, difficulty, tag, page, size));
    }

    @GetMapping("/pantry")
    public ResponseEntity<java.util.List<RecipeDto>> getPantryRecipes(@RequestParam java.util.List<String> ingredients) {
        return ResponseEntity.ok(recipeService.getPantryRecipes(ingredients));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@Valid @RequestBody RecipeDto recipeDto) {
        return new ResponseEntity<>(recipeService.createRecipe(recipeDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok("Recipe deleted successfully");
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<java.util.List<com.foodblog.dto.ReviewDto>> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByRecipeId(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<com.foodblog.dto.ReviewDto> addReview(
            @PathVariable Long id,
            @Valid @RequestBody com.foodblog.dto.ReviewDto reviewDto) {
        return new ResponseEntity<>(reviewService.addReview(id, reviewDto), HttpStatus.CREATED);
    }
}
