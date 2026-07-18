package com.foodblog.service;

import org.springframework.stereotype.Service;
import com.foodblog.entity.Recipe;
import java.util.List;

@Service
public class NutritionService {

    public void calculateAndSetMacros(Recipe recipe) {
        // Mock calculation: Fallback behavior since API keys are not provided.
        // In a production environment, you would use a RestTemplate or WebClient 
        // to call an API like Edamam or Spoonacular here.
        
        List<String> ingredients = recipe.getIngredients();
        if (ingredients == null || ingredients.isEmpty()) {
            recipe.setCalories(0.0);
            recipe.setProtein(0.0);
            recipe.setCarbs(0.0);
            recipe.setFats(0.0);
            return;
        }

        double totalCalories = 0.0;
        double totalProtein = 0.0;
        double totalCarbs = 0.0;
        double totalFats = 0.0;

        // Simple mock logic: assigning static values per ingredient
        for (String ignored : ingredients) {
            totalCalories += 85.5; // average calories per generic ingredient
            totalProtein += 3.2;
            totalCarbs += 10.5;
            totalFats += 4.0;
        }

        recipe.setCalories(totalCalories);
        recipe.setProtein(totalProtein);
        recipe.setCarbs(totalCarbs);
        recipe.setFats(totalFats);
    }
}
