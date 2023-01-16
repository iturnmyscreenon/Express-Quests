require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const movieHandlers = require("./movieHandlers");

const userHandlers = require("./userHandlers");

const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");



// public route 

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/movies/:id/color", movieHandlers.getMovie);
app.get("/api/movies/:id/max_duration", movieHandlers.getMovie);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.get("/api/users/:id/language", userHandlers.getUsers);
app.get("/api/users/:id/city", userHandlers.getUsers);
app.post ("/api/users", hashPassword, userHandlers.postUsers);
app.post("/api/users/login", verifyPassword);

//protected route

app.use(verifyToken);


app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put("/api/users/:id", userHandlers.putUsers);
app.delete("/api/users/:id", userHandlers.deleteUsers);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});







