const express = require("express")
const { addToWatchList, removeFromWatchList, updateWatchListItem } = require("../controllers/watchlistController.js")
const { authMiddleware } = require("../middleware/authMiddleware.js")
const { validateRequest } = require("../middleware/validateRequest.js")
const  addToWatchListSchema  = require("../validators/watchlistValidators.js")

const router = express.Router();

// At first the middleware will exeucte followed by the request handler
router.use(authMiddleware);

router.post("/", validateRequest(addToWatchListSchema), addToWatchList);

router.put("/:id", updateWatchListItem);

// {{baseURL}}/watchlist/:id
router.delete("/:id", removeFromWatchList)

module.exports = router;

// A middleware is a function where it sits between the request and response, it acts before the request handler is executed