package com.recepie.recepieapp.repository;

import com.recepie.recepieapp.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findTop20ByOrderByCreatedAtDesc();
}