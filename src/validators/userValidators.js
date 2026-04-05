const { z } = require("zod")

const registerControllerSchema = z.object({
    name: z.string().trim().min(2, "Name must be atleat 2 characters"),
    email: z.string().trim().min(1, "Email is required").email("Please provide a valid email address").toLowerCase(),
    password: z.string().min(6, "Password must be atleast 6 characters")
})

const loginUserSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Please provide a valid email address").toLowerCase(),
    password: z.string().min(6, "Password must be atleast 6 characters")
})

module.exports = { registerControllerSchema, loginUserSchema }