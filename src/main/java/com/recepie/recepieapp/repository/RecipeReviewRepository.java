package com.recepie.recepieapp.repository;

import com.recepie.recepieapp.model.RecipeReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeReviewRepository
        extends JpaRepository<RecipeReview, Integer> {

    List<RecipeReview> findByRecipeId(Integer recipeId);
}