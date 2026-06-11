# Cooksy / Recepie App

This repository contains a full-stack recipe application with a Spring Boot backend and an Angular frontend (under `crave-frontend`). The project provides basic recipe, reviews and favorites APIs and a single-page Angular client. It is an in-progress project with multiple planned features (fridge items, recipe recommendations, shopping lists, etc.).

---

## Table of contents
- Project overview
- Tech stack
- What is implemented (quick summary)
- Project structure
- Backend — how to run
- Frontend — how to run
- Database — configuration and example credentials
- API endpoints (available)
- Development notes & TODO / planned features
- Troubleshooting

---

## Project overview

The application aims to provide recipe discovery and management with user accounts, reviews and favorites. The backend exposes REST endpoints for recipes, reviews, favorites, and some queries via JdbcTemplate. The Angular frontend (in `crave-frontend`) consumes these APIs.

This repository is still under active development and several features are TODO (see the TODO section below).

## Tech stack

- Backend: Spring Boot 2.7.x, Spring Data JPA, Spring Security (configured permissive for dev), JDBC template for some queries
- Database: PostgreSQL
- Frontend: Angular (Angular CLI generated project under `crave-frontend`)
- Build: Maven (wrapper included: `mvnw`, `mvnw.cmd`)

## What is implemented

- REST API for recipes
- Endpoints to get recipe details, ingredients, and reviews
- Add reviews and mark recipes as favorite (via JdbcTemplate)
- Simple login endpoint that checks email/password against the `user` table (no token-based auth yet)
- Basic CORS configuration allowing `http://localhost:4200`

## Project structure (important folders)

- `src/main/java/com/recepie/recepieapp` — backend source
  - `controller/` — REST controllers (AuthController, RecipeController)
  - `model/` — JPA entities (Recipe, RecipeReview, Ingredient, RecipeIngredient, User)
  - `repository/` — Spring Data repositories (RecipeRepository, UserRepository, RecipeReviewRepository, ...)
- `src/main/resources/application.properties` — Spring Boot configuration
- `crave-frontend/` — Angular frontend project (separate README inside)

## Backend — how to run

Requirements
- JDK 8 or newer installed (the project pom.xml currently sets `java.version` to 1.8). Prefer JDK 11+ or 17 for improved compatibility.
- PostgreSQL running and accessible from your machine

From the repository root (Windows PowerShell):

```powershell
# run the backend using the included Maven wrapper
.\mvnw.cmd spring-boot:run
```

If you prefer to build an executable jar first:

```powershell
.\mvnw.cmd clean package
java -jar target/recepieapp-0.0.1-SNAPSHOT.jar
```

The backend starts on port 8080 by default. The example `SecurityConfig` in the project currently permits all requests (development mode).

## Frontend — how to run

Change into the frontend directory and use Angular CLI commands. If you don't have the Angular CLI globally installed, you can use the local npm scripts after `npm install`.

```powershell
cd crave-frontend
npm install
ng serve
# or if `ng` is not installed globally: npx ng serve
```

Open `http://localhost:4200` in your browser. The frontend is configured to call the backend API at `/api` on `localhost:8080` (CORS is enabled for `http://localhost:4200`).

## Database — configuration

The application expects a PostgreSQL database. The default `application.properties` currently points to a local database; you must update it for your environment.

File: `src/main/resources/application.properties`

Example configuration (replace or set these values):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/advdb_202526l_prj_cooksy
spring.datasource.username=advdb_202526l_prj_cooksy_owner
spring.datasource.password=638c0768ffd5

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Important security note: Do NOT commit real credentials to source control. For production / shared repositories, use environment variables, a secrets manager, or externalized configuration.

## Database schema (tables referenced by the code)

The code uses the following tables (names are taken from JPA entity annotations and SQL in JdbcTemplate calls):

- `recipe` — main recipes table (columns: id, name, description, image, servings, proteins, fat, carbs, spice_level, total_time, calories, created_at, cuisine_id, external_id)
- `recipe_review` — reviews (user_id, recipe_id, rating, comment, created_at)
- `ingredient` — ingredient master (id, name)
- `recipe_ingredient` — join table between recipe and ingredient (recipe_id, ingredient_id, quantity)
- `recipe_favorite` — favorites (user_id, recipe_id)
- `recipe_attempt` — a small table the code inserts to mark attempts (user_id, recipe_id, attempted_at) — referenced in addReview endpoint
- `"user"` — users table (note the table name is quoted in the entity)

If you already have a postgres dump or schema, ensure these tables exist and column names match the entities.

## API — available endpoints (summary)

Base path: `/api`

- GET `/api/recipes` — list recipes (backend returns a limited list)
- GET `/api/recipes/{id}` — recipe details by id
- GET `/api/recipes/{id}/ingredients` — list ingredient names for a recipe (uses JdbcTemplate)
- GET `/api/recipes/{id}/reviews` — list reviews for a recipe
- POST `/api/recipes/{id}/reviews` — add a review (request body: JSON matching `dto.ReviewRequest` — includes userId, rating, comment). This endpoint also inserts a `recipe_attempt` row.
- POST `/api/recipes/{id}/favorite?userId={userId}` — mark recipe favorite for a user
- GET `/api/users/{userId}/favorites` — list favorite recipes for a user (uses JdbcTemplate)

Auth endpoints (simple DB-backed check):
- POST `/api/auth/login` — login by email/password (request body: `dto.LoginRequest`)

Note: Authentication is currently basic and returns the User object if password matches; there is no JWT/session token system implemented yet.

## Development notes & TODO (planned features)

Planned and suggested features to add (many of these are mentioned by the project owner):

- Fridge / pantry items: allow users to list ingredients they have and filter / recommend recipes accordingly
- Recipe recommendations based on fridge contents, user favorites, and review ratings
- Shopping list and automatic ingredient aggregation
- User profiles, registration, secure authentication (JWT), and password hashing
- Image upload and storage for recipes (S3 or local)
- Admin panel to manage recipes, ingredients and external imports
- Unit and integration tests for controllers and repositories
- Better error handling and validation (controller advice for exceptions)
- Pagination for recipe lists and API responses
- Move SQL used in JdbcTemplate into repository layer or named queries

## Troubleshooting

- Backend won't start: ensure a compatible JDK is installed and `JAVA_HOME` is set. The project uses Maven wrapper; if you see a message like "No compiler is provided", install a JDK (not only a JRE).
- Database connection errors: make sure PostgreSQL is running and the `spring.datasource.*` values in `application.properties` are correct. Check the port (5432 vs 5433), database name, user and password.
- Port conflicts: backend defaults to 8080, frontend to 4200. Change them if needed.

---