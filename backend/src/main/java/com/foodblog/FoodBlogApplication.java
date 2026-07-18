package com.foodblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FoodBlogApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodBlogApplication.class, args);
    }
}
