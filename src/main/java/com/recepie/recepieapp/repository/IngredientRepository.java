package com.recepie.recepieapp.repository;

import com.recepie.recepieapp.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository
        extends JpaRepository<Ingredient, Integer> {
}