const express = require('express');
const { validateRequest } = require("../middleware/validateRequest.js")
const { createMovieSchema, updateMovieSchema } = require("../validators/movieValidators.js")

const router = express.Router();

router.get('/', (req, res) => {
    res.json({httpMethod: "get"});
});

router.post('/', validateRequest(createMovieSchema),(req, res) => {
    res.json({httpMethod: "post"});
});

router.put('/', validateRequest(updateMovieSchema),(req, res) => {
    res.json({httpMethod: "put"});
});

router.delete('/', (req, res) => {
    res.json({httpMethod: "delete"});
});

module.exports = router;


