package com.recepie.recepieapp.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name="recipe")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition="TEXT")
    private String description;

    private String image;

    private Integer servings;

    private Integer proteins;

    private Integer fat;

    private Integer carbs;

    @Column(name = "spice_level")
    private Integer spiceLevel;

    @Column(name = "total_time")
    private Integer totalTime;

    private Integer calories;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "cuisine_id")
    private Integer cuisineId;

    @Column(name = "external_id")
    private Integer externalId;

    public Recipe(){}

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getDescription() { return description; }

    public String getImage() { return image; }

    public Integer getServings() { return servings; }

    public Integer getProteins() { return proteins; }

    public Integer getFat() { return fat; }

    public Integer getCarbs() { return carbs; }

    public Integer getSpiceLevel() { return spiceLevel; }

    public Integer getTotalTime() { return totalTime; }

    public Integer getCalories() { return calories; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Integer getCuisineId() { return cuisineId; }

    public Integer getExternalId() { return externalId; }

    public void setId(Long id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setDescription(String description) { this.description = description; }

    public void setImage(String image) { this.image = image; }

    public void setServings(Integer servings) { this.servings = servings; }

    public void setProteins(Integer proteins) { this.proteins = proteins; }

    public void setFat(Integer fat) { this.fat = fat; }

    public void setCarbs(Integer carbs) { this.carbs = carbs; }

    public void setSpiceLevel(Integer spiceLevel) { this.spiceLevel = spiceLevel; }

    public void setTotalTime(Integer totalTime) { this.totalTime = totalTime; }

    public void setCalories(Integer calories) { this.calories = calories; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setCuisineId(Integer cuisineId) { this.cuisineId = cuisineId; }

    public void setExternalId(Integer externalId) { this.externalId = externalId; }
}