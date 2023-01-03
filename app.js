require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/movies/:id/color", movieHandlers.getMovieColor);
app.get("/api/movies/:id/max_duration", movieHandlers.getMovieMaxDuration);
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.get("/api/users/:id/language", userHandlers.getUserLanguage);
app.get("/api/users/:id/city", userHandlers.getUserCity);
app.post("/api/users", userHandlers.postUsers);
app.put("/api/users/:id", userHandlers.putUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const {hashPassword} = require("./auth.js");

app.post ("/api/users", hashPassword, userHandlers.postUsers);
