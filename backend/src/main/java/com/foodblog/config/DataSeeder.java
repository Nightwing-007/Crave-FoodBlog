package com.foodblog.config;

import com.foodblog.entity.Recipe;
import com.foodblog.entity.User;
import com.foodblog.enums.Role;
import com.foodblog.repository.RecipeRepository;
import com.foodblog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with sample users and recipes for development/testing.
 *
 * Activated by setting: foodblog.seed=true
 *
 * Usage:
 *   mvn spring-boot:run -Dspring-boot.run.arguments="--foodblog.seed=true"
 *   or add foodblog.seed=true to application-local.properties
 *
 * All seeded users have the password: password123
 */
@Configuration
@ConditionalOnProperty(name = "foodblog.seed", havingValue = "true")
public class DataSeeder {

    @Bean
    @Order(2) // Run after DataInitializer (Order 1 by default)
    public CommandLineRunner seedData(UserRepository userRepository,
                                      RecipeRepository recipeRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Skip if data already exists (recipes table not empty)
            if (recipeRepository.count() > 0) {
                System.out.println("[SEEDER] Data already exists — skipping seed.");
                return;
            }

            System.out.println("[SEEDER] Seeding database with sample data...");

            // ──────────────────────────────────────────────
            // 1. Create Users
            // ──────────────────────────────────────────────
            String encodedPassword = passwordEncoder.encode("password123");

            User chef1 = userRepository.save(User.builder()
                    .name("Gordon Ramsay")
                    .email("gordon@crave.com")
                    .password(encodedPassword)
                    .role(Role.USER)
                    .build());

            User chef2 = userRepository.save(User.builder()
                    .name("Julia Child")
                    .email("julia@crave.com")
                    .password(encodedPassword)
                    .role(Role.USER)
                    .build());

            User chef3 = userRepository.save(User.builder()
                    .name("Jamie Oliver")
                    .email("jamie@crave.com")
                    .password(encodedPassword)
                    .role(Role.USER)
                    .build());

            System.out.println("[SEEDER] Created 3 sample users.");

            // ──────────────────────────────────────────────
            // 2. Create Recipes
            // ──────────────────────────────────────────────

            // ── BREAKFAST ──
            Recipe r1 = recipeRepository.save(Recipe.builder()
                    .title("Fluffy Buttermilk Pancakes")
                    .category("Breakfast")
                    .cookingTime(20)
                    .imageUrl("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.\n" +
                            "2. In a separate bowl, beat eggs, then add buttermilk and melted butter.\n" +
                            "3. Pour wet ingredients into dry ingredients and stir until just combined (lumps are okay!).\n" +
                            "4. Heat a griddle or non-stick pan over medium heat. Lightly grease with butter.\n" +
                            "5. Pour 1/4 cup batter per pancake. Cook until bubbles form on the surface, then flip.\n" +
                            "6. Cook for another 1-2 minutes until golden brown.\n" +
                            "7. Serve with maple syrup, fresh berries, and a dusting of powdered sugar.")
                    .ingredients(Arrays.asList(
                            "2 cups all-purpose flour", "2 tablespoons sugar", "2 teaspoons baking powder",
                            "1 teaspoon baking soda", "1/2 teaspoon salt", "2 large eggs",
                            "2 cups buttermilk", "1/4 cup melted butter", "Maple syrup for serving"))
                    .creator(chef1)
                    .build());

            Recipe r2 = recipeRepository.save(Recipe.builder()
                    .title("Avocado Toast with Poached Eggs")
                    .category("Breakfast")
                    .cookingTime(15)
                    .imageUrl("https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Toast the sourdough bread slices until golden and crispy.\n" +
                            "2. While bread is toasting, cut avocados in half and remove the pit.\n" +
                            "3. Scoop avocado into a bowl, add lemon juice, salt, and red pepper flakes. Mash with a fork.\n" +
                            "4. Bring a pot of water to a gentle simmer. Add a splash of vinegar.\n" +
                            "5. Create a gentle whirlpool and crack an egg into the center. Poach for 3-4 minutes.\n" +
                            "6. Spread mashed avocado generously on the toasted bread.\n" +
                            "7. Top each toast with a poached egg, everything bagel seasoning, and microgreens.")
                    .ingredients(Arrays.asList(
                            "2 slices sourdough bread", "1 ripe avocado", "2 large eggs",
                            "1 tablespoon lemon juice", "Red pepper flakes", "Everything bagel seasoning",
                            "Salt and pepper to taste", "Microgreens for garnish", "1 teaspoon white vinegar"))
                    .creator(chef2)
                    .build());

            Recipe r3 = recipeRepository.save(Recipe.builder()
                    .title("Classic French Omelette")
                    .category("Breakfast")
                    .cookingTime(10)
                    .imageUrl("https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Crack 3 eggs into a bowl and beat with a fork until yolks and whites are just combined.\n" +
                            "2. Season with a pinch of salt and white pepper.\n" +
                            "3. Heat a non-stick pan over medium-low heat. Add butter and let it foam.\n" +
                            "4. Pour in the eggs and stir continuously with a spatula, shaking the pan.\n" +
                            "5. When the eggs are mostly set but still slightly wet on top, stop stirring.\n" +
                            "6. Add your choice of fillings (cheese, herbs, mushrooms) to one side.\n" +
                            "7. Fold the omelette in thirds and slide onto a warm plate. Garnish with fresh chives.")
                    .ingredients(Arrays.asList(
                            "3 large eggs", "1 tablespoon butter", "Pinch of salt",
                            "White pepper", "2 tablespoons grated Gruyère cheese",
                            "1 tablespoon fresh chives, chopped", "Optional: sautéed mushrooms"))
                    .creator(chef3)
                    .build());

            // ── LUNCH ──
            Recipe r4 = recipeRepository.save(Recipe.builder()
                    .title("Mediterranean Chicken Bowl")
                    .category("Lunch")
                    .cookingTime(35)
                    .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Marinate chicken thighs in olive oil, lemon juice, garlic, oregano, and paprika for at least 30 minutes.\n" +
                            "2. Cook quinoa according to package instructions and fluff with a fork.\n" +
                            "3. Grill or pan-sear the chicken over medium-high heat for 6-7 minutes per side.\n" +
                            "4. Let chicken rest for 5 minutes, then slice against the grain.\n" +
                            "5. Prepare tzatziki: mix Greek yogurt, grated cucumber, garlic, lemon, dill, and salt.\n" +
                            "6. Assemble bowls: quinoa base, sliced chicken, cherry tomatoes, cucumber, red onion, olives, and feta.\n" +
                            "7. Drizzle with tzatziki and a squeeze of fresh lemon juice.")
                    .ingredients(Arrays.asList(
                            "2 chicken thighs, boneless", "1 cup quinoa", "1/2 cup cherry tomatoes, halved",
                            "1/4 cup Kalamata olives", "1/4 cup crumbled feta cheese", "1/4 cucumber, diced",
                            "1/4 red onion, thinly sliced", "1/2 cup Greek yogurt (for tzatziki)",
                            "2 tablespoons olive oil", "1 lemon, juiced", "Fresh dill and oregano"))
                    .creator(chef1)
                    .build());

            Recipe r5 = recipeRepository.save(Recipe.builder()
                    .title("Spicy Thai Basil Noodles")
                    .category("Lunch")
                    .cookingTime(25)
                    .imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Cook rice noodles according to package directions. Drain and rinse with cold water.\n" +
                            "2. Mix sauce: combine soy sauce, oyster sauce, fish sauce, brown sugar, and chili flakes.\n" +
                            "3. Heat oil in a wok over high heat until smoking.\n" +
                            "4. Add garlic and Thai chilies, stir-fry for 30 seconds.\n" +
                            "5. Add protein (chicken, shrimp, or tofu) and cook until done.\n" +
                            "6. Add noodles and sauce, toss everything together for 2 minutes.\n" +
                            "7. Remove from heat, fold in Thai basil leaves until wilted. Serve with lime wedges.")
                    .ingredients(Arrays.asList(
                            "200g rice noodles", "2 tablespoons soy sauce", "1 tablespoon oyster sauce",
                            "1 tablespoon fish sauce", "1 tablespoon brown sugar", "3 cloves garlic, minced",
                            "2 Thai bird chilies, sliced", "1 cup Thai basil leaves", "200g chicken breast, sliced",
                            "2 tablespoons vegetable oil", "Lime wedges for serving"))
                    .creator(chef2)
                    .build());

            // ── DINNER ──
            Recipe r6 = recipeRepository.save(Recipe.builder()
                    .title("Pan-Seared Salmon with Lemon Dill Sauce")
                    .category("Dinner")
                    .cookingTime(25)
                    .imageUrl("https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Pat salmon fillets dry and season generously with salt and pepper.\n" +
                            "2. Heat olive oil in a cast iron skillet over medium-high heat.\n" +
                            "3. Place salmon skin-side up and sear for 4 minutes without moving.\n" +
                            "4. Flip and cook skin-side down for another 3-4 minutes.\n" +
                            "5. For the sauce: in a small pan, melt butter, add minced garlic, cook 30 seconds.\n" +
                            "6. Add lemon juice, white wine, capers, and fresh dill. Simmer for 2 minutes.\n" +
                            "7. Plate the salmon, spoon the lemon dill sauce over the top, and serve with roasted asparagus.")
                    .ingredients(Arrays.asList(
                            "2 salmon fillets (6 oz each)", "2 tablespoons olive oil", "3 tablespoons butter",
                            "3 cloves garlic, minced", "Juice of 1 lemon", "1/4 cup dry white wine",
                            "2 tablespoons capers", "3 tablespoons fresh dill, chopped",
                            "Salt and pepper to taste", "1 bunch asparagus"))
                    .creator(chef1)
                    .build());

            Recipe r7 = recipeRepository.save(Recipe.builder()
                    .title("Homemade Margherita Pizza")
                    .category("Dinner")
                    .cookingTime(45)
                    .imageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Preheat oven to 500°F (260°C) with a pizza stone or inverted baking sheet inside.\n" +
                            "2. Stretch the pizza dough on a floured surface into a 12-inch circle.\n" +
                            "3. Spread a thin layer of San Marzano tomato sauce, leaving a 1-inch border.\n" +
                            "4. Tear fresh mozzarella into pieces and distribute evenly over the sauce.\n" +
                            "5. Drizzle with extra virgin olive oil and season with salt.\n" +
                            "6. Carefully transfer pizza to the hot stone. Bake for 8-12 minutes until crust is golden.\n" +
                            "7. Remove from oven, top with fresh basil leaves and a final drizzle of olive oil. Slice and serve.")
                    .ingredients(Arrays.asList(
                            "1 ball pizza dough (store-bought or homemade)", "1/2 cup San Marzano tomato sauce",
                            "200g fresh mozzarella", "Fresh basil leaves", "Extra virgin olive oil",
                            "Pinch of sea salt", "Semolina flour for dusting"))
                    .creator(chef3)
                    .build());

            Recipe r8 = recipeRepository.save(Recipe.builder()
                    .title("Creamy Tuscan Garlic Chicken")
                    .category("Dinner")
                    .cookingTime(30)
                    .imageUrl("https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Season chicken breasts with Italian seasoning, salt, and pepper.\n" +
                            "2. Heat olive oil in a large skillet over medium-high heat. Sear chicken 5-6 minutes per side. Remove and set aside.\n" +
                            "3. In the same skillet, add garlic and cook for 1 minute.\n" +
                            "4. Add sun-dried tomatoes and spinach, cook until spinach wilts.\n" +
                            "5. Pour in heavy cream and chicken broth, bring to a simmer.\n" +
                            "6. Stir in Parmesan cheese until melted and sauce thickens (about 3 minutes).\n" +
                            "7. Return chicken to the skillet, spoon sauce over, and simmer 5 more minutes. Serve over pasta or rice.")
                    .ingredients(Arrays.asList(
                            "2 chicken breasts", "1 cup heavy cream", "1/2 cup chicken broth",
                            "1/2 cup sun-dried tomatoes, chopped", "2 cups fresh spinach",
                            "1/2 cup grated Parmesan cheese", "4 cloves garlic, minced",
                            "1 teaspoon Italian seasoning", "2 tablespoons olive oil", "Salt and pepper"))
                    .creator(chef2)
                    .build());

            // ── DESSERT ──
            Recipe r9 = recipeRepository.save(Recipe.builder()
                    .title("Molten Chocolate Lava Cake")
                    .category("Dessert")
                    .cookingTime(20)
                    .imageUrl("https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Preheat oven to 425°F (220°C). Butter and flour two 6-oz ramekins.\n" +
                            "2. Melt dark chocolate and butter together in a microwave or double boiler.\n" +
                            "3. Whisk in powdered sugar until smooth.\n" +
                            "4. Add eggs and egg yolks one at a time, whisking after each addition.\n" +
                            "5. Fold in flour gently until just incorporated.\n" +
                            "6. Divide batter between prepared ramekins. Bake for 12-14 minutes.\n" +
                            "7. The edges should be firm but the center should be soft. Invert onto plates immediately and serve with vanilla ice cream.")
                    .ingredients(Arrays.asList(
                            "4 oz dark chocolate (70% cocoa)", "1/2 cup unsalted butter",
                            "1 cup powdered sugar", "2 large eggs", "2 egg yolks",
                            "6 tablespoons all-purpose flour", "Butter and cocoa for ramekins",
                            "Vanilla ice cream for serving"))
                    .creator(chef1)
                    .build());

            Recipe r10 = recipeRepository.save(Recipe.builder()
                    .title("Classic New York Cheesecake")
                    .category("Dessert")
                    .cookingTime(90)
                    .imageUrl("https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Preheat oven to 325°F (165°C). Wrap the outside of a 9-inch springform pan with foil.\n" +
                            "2. Crust: Mix graham cracker crumbs, sugar, and melted butter. Press into bottom of pan. Bake 10 minutes.\n" +
                            "3. Filling: Beat cream cheese until smooth. Add sugar and beat until fluffy.\n" +
                            "4. Mix in sour cream and vanilla extract.\n" +
                            "5. Add eggs one at a time on low speed, mixing just until combined.\n" +
                            "6. Pour filling over crust. Place pan in a water bath and bake for 55-60 minutes.\n" +
                            "7. Turn off oven, crack the door, and let cheesecake cool inside for 1 hour. Refrigerate overnight before serving.")
                    .ingredients(Arrays.asList(
                            "32 oz cream cheese, softened", "1 cup sugar", "1 cup sour cream",
                            "1 teaspoon vanilla extract", "5 large eggs", "2 cups graham cracker crumbs",
                            "1/3 cup sugar (for crust)", "5 tablespoons melted butter",
                            "Fresh berries for topping"))
                    .creator(chef3)
                    .build());

            Recipe r11 = recipeRepository.save(Recipe.builder()
                    .title("Tiramisu")
                    .category("Dessert")
                    .cookingTime(30)
                    .imageUrl("https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Brew strong espresso and let it cool. Stir in Marsala wine or coffee liqueur.\n" +
                            "2. Separate eggs. Beat yolks with sugar until thick and pale yellow.\n" +
                            "3. Add mascarpone cheese to the yolk mixture and fold gently until smooth.\n" +
                            "4. In a separate bowl, whip egg whites to stiff peaks. Fold into mascarpone mixture.\n" +
                            "5. Quickly dip ladyfinger biscuits into the espresso mixture (don't soak!).\n" +
                            "6. Layer dipped ladyfingers in a dish, then spread mascarpone cream. Repeat layers.\n" +
                            "7. Refrigerate for at least 4 hours (overnight is best). Dust with cocoa powder before serving.")
                    .ingredients(Arrays.asList(
                            "500g mascarpone cheese", "6 large eggs, separated", "3/4 cup sugar",
                            "2 cups strong espresso, cooled", "3 tablespoons Marsala wine",
                            "300g ladyfinger biscuits (Savoiardi)", "Unsweetened cocoa powder for dusting"))
                    .creator(chef2)
                    .build());

            // ── SNACK ──
            Recipe r12 = recipeRepository.save(Recipe.builder()
                    .title("Crispy Garlic Parmesan Wings")
                    .category("Snack")
                    .cookingTime(40)
                    .imageUrl("https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.\n" +
                            "2. Pat chicken wings completely dry with paper towels.\n" +
                            "3. Toss wings with baking powder, salt, garlic powder, and pepper.\n" +
                            "4. Arrange in a single layer on the baking sheet. Bake for 20 minutes.\n" +
                            "5. Flip wings and bake another 15-20 minutes until golden and crispy.\n" +
                            "6. While wings bake, melt butter with minced garlic, then stir in grated Parmesan and parsley.\n" +
                            "7. Toss baked wings in the garlic Parmesan butter and serve immediately with ranch dip.")
                    .ingredients(Arrays.asList(
                            "2 lbs chicken wings", "1 tablespoon baking powder", "1 teaspoon garlic powder",
                            "1/2 cup grated Parmesan cheese", "4 tablespoons melted butter",
                            "4 cloves garlic, minced", "2 tablespoons fresh parsley, chopped",
                            "Salt and pepper to taste", "Ranch dressing for dipping"))
                    .creator(chef3)
                    .build());

            Recipe r13 = recipeRepository.save(Recipe.builder()
                    .title("Loaded Sweet Potato Nachos")
                    .category("Snack")
                    .cookingTime(30)
                    .imageUrl("https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Preheat oven to 400°F (200°C). Slice sweet potatoes into thin rounds.\n" +
                            "2. Toss sweet potato rounds with olive oil, cumin, chili powder, salt, and pepper.\n" +
                            "3. Arrange in a single layer on baking sheets. Bake for 15 minutes, flip, bake 10 more minutes.\n" +
                            "4. While baking, prepare toppings: cook black beans with cumin, dice avocado, make quick-pickled red onions.\n" +
                            "5. Transfer crispy sweet potato rounds to an oven-safe platter.\n" +
                            "6. Top with shredded cheese and return to oven for 3 minutes until cheese melts.\n" +
                            "7. Load up with black beans, avocado, jalapeños, sour cream, cilantro, and a squeeze of lime.")
                    .ingredients(Arrays.asList(
                            "2 large sweet potatoes, thinly sliced", "1 can black beans, drained",
                            "1 cup shredded Mexican cheese blend", "1 avocado, diced",
                            "1/4 cup sour cream", "Jalapeño slices", "Fresh cilantro",
                            "1 teaspoon cumin", "1 teaspoon chili powder", "2 tablespoons olive oil", "Lime wedges"))
                    .creator(chef1)
                    .build());

            Recipe r14 = recipeRepository.save(Recipe.builder()
                    .title("Homemade Hummus with Roasted Red Pepper")
                    .category("Snack")
                    .cookingTime(10)
                    .imageUrl("https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=800")
                    .instructions(
                            "1. Drain and rinse chickpeas. For extra smooth hummus, rub chickpeas between your hands to remove skins.\n" +
                            "2. Add chickpeas to a food processor with tahini, lemon juice, garlic, and salt.\n" +
                            "3. Process for 2 minutes, scraping down the sides as needed.\n" +
                            "4. With the processor running, slowly drizzle in ice water until silky smooth.\n" +
                            "5. Add roasted red peppers and pulse a few times to incorporate (or blend fully for a smooth texture).\n" +
                            "6. Taste and adjust seasoning — add more lemon, salt, or garlic as desired.\n" +
                            "7. Transfer to a bowl, make a well in the center, drizzle with olive oil, sprinkle with paprika and pine nuts. Serve with warm pita.")
                    .ingredients(Arrays.asList(
                            "2 cans chickpeas (15 oz each)", "1/3 cup tahini", "Juice of 2 lemons",
                            "2 cloves garlic", "1/2 cup roasted red peppers", "3-4 tablespoons ice water",
                            "1/2 teaspoon cumin", "Salt to taste", "Extra virgin olive oil",
                            "Smoked paprika", "Pine nuts", "Warm pita bread for serving"))
                    .creator(chef2)
                    .build());

            List<Recipe> allRecipes = Arrays.asList(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14);
            System.out.println("[SEEDER] Created " + allRecipes.size() + " sample recipes.");

            // ──────────────────────────────────────────────
            // 3. Add some Favorites (cross-user interactions)
            // ──────────────────────────────────────────────
            chef1.getFavoriteRecipes().add(r5);  // Gordon likes Julia's Thai noodles
            chef1.getFavoriteRecipes().add(r7);  // Gordon likes Jamie's pizza
            chef1.getFavoriteRecipes().add(r11); // Gordon likes Julia's tiramisu

            chef2.getFavoriteRecipes().add(r1);  // Julia likes Gordon's pancakes
            chef2.getFavoriteRecipes().add(r6);  // Julia likes Gordon's salmon
            chef2.getFavoriteRecipes().add(r12); // Julia likes Jamie's wings

            chef3.getFavoriteRecipes().add(r9);  // Jamie likes Gordon's lava cake
            chef3.getFavoriteRecipes().add(r4);  // Jamie likes Gordon's Mediterranean bowl
            chef3.getFavoriteRecipes().add(r8);  // Jamie likes Julia's Tuscan chicken
            chef3.getFavoriteRecipes().add(r14); // Jamie likes Julia's hummus

            userRepository.saveAll(Arrays.asList(chef1, chef2, chef3));
            System.out.println("[SEEDER] Added favorites for all users.");

            // ──────────────────────────────────────────────
            // Summary
            // ──────────────────────────────────────────────
            System.out.println();
            System.out.println("╔══════════════════════════════════════════════════════╗");
            System.out.println("║              SEED COMPLETE ✓                        ║");
            System.out.println("╠══════════════════════════════════════════════════════╣");
            System.out.println("║  Users created: 3 (+ admin from DataInitializer)    ║");
            System.out.println("║  Recipes created: 14                                ║");
            System.out.println("║  Favorites added: 10                                ║");
            System.out.println("║                                                      ║");
            System.out.println("║  Login credentials (all users):                      ║");
            System.out.println("║    Admin:  admin@foodblog.com / admin123             ║");
            System.out.println("║    User1:  gordon@crave.com  / password123           ║");
            System.out.println("║    User2:  julia@crave.com   / password123           ║");
            System.out.println("║    User3:  jamie@crave.com   / password123           ║");
            System.out.println("╚══════════════════════════════════════════════════════╝");
        };
    }
}
