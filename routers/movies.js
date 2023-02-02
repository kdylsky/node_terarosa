const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");

const { Movie, Actor, movie_actor } = require("../models");

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const movie = await Movie.create({
      title: "test2",
    });

    // const actor = await Actor.create({
    //   name: "",
    // });

    const middle = await movie_actor.create({
      movie_id: movie.id,
      actor_id: 1,
    });

    res.send("it work");
  })
);

router.get(
  "/movies",
  wrapAsync(async (req, res) => {
    const movies = await Movie.findOne({
      where: { title: "test" },
      include: [
        {
          model: Actor,

          attributes: ["name"],
          as: "actors",
          through: {
            attributes: ["actor_id", "movie_id"],
          },
        },
      ],
    });
    res.json(movies);
  })
);

router.get(
  "/actors",
  wrapAsync(async (req, res) => {
    const movies = await Actor.findOne({
      where: { name: "kim" },
      include: [
        {
          model: Movie,

          attributes: ["title"],
          as: "movies",
          through: {
            attributes: ["actor_id", "movie_id"],
          },
        },
      ],
    });
    res.json(movies);
  })
);

module.exports = router;
