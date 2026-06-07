package com.recepie.recepieapp.model;

import javax.persistence.*;

@Entity
@Table(name = "recipe_ingredient")
public class RecipeIngredient {

    @Id
    @Column(name = "recipe_id")
    private Integer recipeId;

    @Column(name = "ingredient_id")
    private Integer ingredientId;

    private String quantity;

    public Integer getRecipeId() {
        return recipeId;
    }

    public Integer getIngredientId() {
        return ingredientId;
    }

    public String getQuantity() {
        return quantity;
    }
}