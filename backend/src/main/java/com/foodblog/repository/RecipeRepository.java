package com.foodblog.repository;

import com.foodblog.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category, Pageable pageable);
    Page<Recipe> findByCategoryIgnoreCase(String category, Pageable pageable);
    Page<Recipe> findByCategoryIgnoreCaseAndTitleContainingIgnoreCase(String category, String title, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r FROM Recipe r LEFT JOIN r.tags t WHERE " +
            "(:category IS NULL OR LOWER(r.category) = :category) AND " +
            "(:search IS NULL OR LOWER(r.title) LIKE CONCAT('%', :search, '%')) AND " +
            "(:difficulty IS NULL OR r.difficulty = :difficulty) AND " +
            "(:tag IS NULL OR LOWER(t) = :tag)")
    Page<Recipe> findRecipesWithFilters(
            @org.springframework.data.repository.query.Param("search") String search, 
            @org.springframework.data.repository.query.Param("category") String category, 
            @org.springframework.data.repository.query.Param("difficulty") com.foodblog.entity.Difficulty difficulty, 
            @org.springframework.data.repository.query.Param("tag") String tag, 
            Pageable pageable);
}
