const express = require('express');
const { registerController, loginUser, logoutUser } = require('../controllers/authController');
const { registerControllerSchema, loginUserSchema } = require('../validators/userValidators.js')
const { validateRequest } = require("../middleware/validateRequest.js")

const router = express.Router();

router.post("/register", validateRequest(registerControllerSchema), registerController);
router.post("/login", validateRequest(loginUserSchema), loginUser)
router.post("/logout", logoutUser)

module.exports = router;