const knex = require('knex');
const router = require('express').Router();
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
  //debug: true,
};
const db = knex(knexConfig);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const zoos = await db("zoos");
      res.status(200).json(zoos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong retrieving the zoos." });
    }
  })
  .post(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Please provide a zoo name." });
    }
    try {
      const [id] = await db("zoos").insert({ name });
      res.status(201).json(id);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong adding the new zoo." });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const zoo = await db("zoos")
        .where({ id })
        .first();
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "The zoo could not be found." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "There was an error retrieving the zoo." });
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res
        .status(400)
        .json({ message: "Please provide an updated name for the zoo." });
    }
    try {
      const count = await db("zoos")
        .where({ id })
        .update({ name });
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "The zoo could not be located." });
      }
    } catch (error) {
      res.status(500).json({ message: "There was an error updating the zoo." });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      const count = await db("zoos")
        .where({ id })
        .del();
      if (count) {
        res.status(200).end();
      } else {
        res.status(404).json({ message: "The zoo could not be located." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong trying to delete the zoo." });
    }
  });

module.exports = router;
