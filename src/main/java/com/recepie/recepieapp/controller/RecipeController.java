package com.recepie.recepieapp.controller;

import com.recepie.recepieapp.dto.ReviewRequest;
import com.recepie.recepieapp.model.Recipe;
import com.recepie.recepieapp.repository.RecipeRepository;
import com.recepie.recepieapp.model.RecipeReview;
import com.recepie.recepieapp.repository.RecipeReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;


@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final RecipeReviewRepository recipeReviewRepository;
    private final JdbcTemplate jdbcTemplate;

    public RecipeController(
            RecipeRepository recipeRepository,
            RecipeReviewRepository recipeReviewRepository,
            JdbcTemplate jdbcTemplate) {

        this.recipeRepository = recipeRepository;
        this.recipeReviewRepository = recipeReviewRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/recipes")
    public List<Recipe> getRecipes(){
        return recipeRepository.findAll().stream().limit(10).collect(Collectors.toList());
    }
    @GetMapping("/recipes/{id}")
    public Recipe getRecipeById(@PathVariable Long id) {

        Recipe recipe = recipeRepository.findById(id).orElseThrow();

        System.out.println("STEPS = " + recipe.getSteps());

        return recipe;
    }
    @GetMapping("/recipes/{id}/reviews")
    public List<RecipeReview> getRecipeReviews(
            @PathVariable Integer id){

        return recipeReviewRepository.findByRecipeId(id);
    }
    @GetMapping("/recipes/{id}/ingredients")
    public List<String> getIngredients(
            @PathVariable Integer id) {

        String sql = """
        SELECT i.name
        FROM recipe_ingredient ri
        JOIN ingredient i
            ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = ?
        """;

        return jdbcTemplate.queryForList(
                sql,
                String.class,
                id
        );
    }

    @PostMapping("/recipes/{id}/reviews")
    public RecipeReview addReview(
            @PathVariable Integer id,
            @RequestBody ReviewRequest request){

        String sql = """
        INSERT INTO recipe_attempt
        (user_id, recipe_id, attempted_at)
        VALUES (?, ?, NOW())
        ON CONFLICT DO NOTHING
        """;

        jdbcTemplate.update(
                sql,
                request.getUserId(),
                id
        );

        RecipeReview review = new RecipeReview();

        review.setRecipeId(id);
        review.setUserId(request.getUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(java.time.LocalDateTime.now());

        return recipeReviewRepository.save(review);
    }
    @PostMapping("/recipes/{id}/favorite")
    public void addFavorite(
            @PathVariable Integer id,
            @RequestParam Integer userId){

        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM recipe_favorite
                WHERE user_id = ?
                AND recipe_id = ?
                """,
                Integer.class,
                userId,
                id
        );

        if(count != null && count > 0){
            return;
        }

        jdbcTemplate.update(
                """
                INSERT INTO recipe_favorite
                (user_id, recipe_id)
                VALUES (?, ?)
                """,
                userId,
                id
        );
    }
    @DeleteMapping("/recipes/{id}/favorite")
    public void removeFavorite(
            @PathVariable Integer id,
            @RequestParam Integer userId){

        jdbcTemplate.update(
                """
                DELETE FROM recipe_favorite
                WHERE user_id = ?
                AND recipe_id = ?
                """,
                userId,
                id
        );
    }

    @GetMapping("/users/{userId}/favorites")
    public List<Recipe> getFavorites(
            @PathVariable Integer userId){

        String sql = """
        SELECT r.*
        FROM recipe_favorite rf
        JOIN recipe r
            ON rf.recipe_id = r.id
        WHERE rf.user_id = ?
        LIMIT 100
        """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {

                    Recipe recipe = new Recipe();

                    recipe.setId(rs.getLong("id"));
                    recipe.setName(rs.getString("name"));
                    recipe.setDescription(
                            rs.getString("description")
                    );

                    recipe.setCalories(
                            rs.getInt("calories")
                    );

                    recipe.setProteins(
                            rs.getInt("proteins")
                    );

                    recipe.setTotalTime(
                            rs.getInt("total_time")
                    );

                    recipe.setImage(
                            rs.getString("image")
                    );

                    return recipe;
                },
                userId
        );
    }

    @GetMapping("/recipes/search")
    public Page<Recipe> searchRecipes(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page){

        return recipeRepository
                .findByNameContainingIgnoreCase(
                        query,
                        PageRequest.of(page, 20)
                );
    }
    @GetMapping("/recipes/trending")
    public List<Recipe> getTrendingRecipes() {

        String sql = """
        SELECT r.*
        FROM recipe r
        JOIN (
            SELECT recipe_id, COUNT(*) AS views
            FROM recipe_view
            GROUP BY recipe_id
            ORDER BY views DESC
            LIMIT 4
        ) rv
        ON r.id = rv.recipe_id
        ORDER BY rv.views DESC
        """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {

                    Recipe recipe = new Recipe();

                    recipe.setId(rs.getLong("id"));
                    recipe.setName(rs.getString("name"));
                    recipe.setDescription(rs.getString("description"));
                    recipe.setCalories(rs.getInt("calories"));
                    recipe.setProteins(rs.getInt("proteins"));
                    recipe.setTotalTime(rs.getInt("total_time"));
                    recipe.setImage(rs.getString("image"));

                    return recipe;
                }
        );
    }


}