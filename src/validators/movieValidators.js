const { z } = require("zod")

const createMovieSchema = z.object({
    title: z.string().trim().min(1, "Movie Title is required"),
    overview: z.string().trim().optional(),
    releaseYear: z.coerce.number().int("Release year must be an integer").min(1888, "Release year must be a valid year").max(new Date().getFullYear() + 10, "Release year must be a valid year"),
    genres: z.array(z.string(), { message: "All genres must be strings" }).optional(),
    runtime: z.coerce.number().int("Runtime must be an integer").positive("Runtime must be a positive number (in minutes)").optional(),
    posterUrl: z.string().url("Poster URL must be a valid URL").optional()
})

const updateMovieSchema = z.object({
    title: z.string().trim().min(1, "Movie Title is required"),
    overview: z.string().trim().optional(),
    releaseYear: z.coerce.number().int("Release year must be an integer").min(1888, "Release year must be a valid year").max(new Date().getFullYear() + 10, "Release year must be a valid year"),
    genres: z.array(z.string(), { message: "All genres must be strings" }).optional(),
    runtime: z.coerce.number().int("Runtime must be an integer").positive("Runtime must be a positive number (in minutes)").optional(),
    posterUrl: z.string().url("Poster URL must be a valid URL").optional()
})

module.exports = { createMovieSchema, updateMovieSchema }