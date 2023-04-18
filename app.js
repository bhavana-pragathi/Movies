//two tables `movie` and `director`

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorName: dbObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const movieQuery = `
    SELECT
      *
    FROM 
      movie;`;
  const movieArray = await database.all(movieQuery);
  response.send(movieArray);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
    INSERT INTO
    movie (director_id, movie_name, lead_actor)
    VALUES 
    (${directorId}, '${movieName}', '${leadActor}');`;
  const postMovie = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.body;
  const getMovieQuery = `
    SELECT
    *
    FROM movie 
    WHERE movie_id=${movieId};`;
  const getMovie = await database.get(getMovieQuery);
  response.send(convertDbObjectToResponseObject(getMovie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMovieQuery = `
  UPDATE
    movie
  SET
    director_id = '${directorId}',
    movie_name = ${movieName},
    lead_actor = '${leadActor}'
  WHERE
    movie_id = ${movieId};`;

  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
  DELETE FROM
    movie
  WHERE
    movie_id = ${movieId};`;
  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const directorQuery = `
    SELECT
      *
    FROM 
      director;`;
  const directorArray = await database.all(directorQuery);
  response.send(directorArray);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { movieName } = request.params;
  const getAllMoviesQuery = `
    SELECT
    *
    FROM
        book
    WHERE
        movie_name = ${movieName};`;
  const moviesArray = await db.all(getAllMoviesQuery);
  response.send(moviesArray);
});

module.exports = app;
