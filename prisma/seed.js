require('dotenv').config();
// console.log("DB URL:", process.env.DATABASE_URL);

const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const { Pool } = require('pg'); // ← Pool instead of Client
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

// Pool automatically manages connections and reconnects
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,                  // max connections in pool
    idleTimeoutMillis: 30000, // close idle connections after 30s
    connectionTimeoutMillis: 10000, // timeout if can't get connection in 10s
});

const adapter = new PrismaPg(pool); // ← pass pool to adapter
const prisma = new PrismaClient({ adapter });

const userId = "15db9211-8572-4204-b9a7-4f84b3cb977f";

const movies = [
    {
        "title": "Inception",
        "overview": "A skilled thief who steals secrets through dream-sharing technology is offered a chance to have his criminal record erased if he can implant an idea into a target's subconscious.",
        "releaseYear": 2010,
        "genres": ["Action", "Sci-Fi", "Thriller"],
        "runtime": 148,
        "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        "createdBy": userId
    },
    {
        "title": "The Dark Knight",
        "overview": "When the Joker emerges from his mysterious past and wreaks havoc on Gotham City, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "releaseYear": 2008,
        "genres": ["Action", "Crime", "Drama"],
        "runtime": 152,
        "posterUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "createdBy": userId
    },
    {
        "title": "Interstellar",
        "overview": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces environmental collapse.",
        "releaseYear": 2014,
        "genres": ["Adventure", "Drama", "Sci-Fi"],
        "runtime": 169,
        "posterUrl": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "createdBy": userId
    },
    {
        "title": "The Shawshank Redemption",
        "overview": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "releaseYear": 1994,
        "genres": ["Drama"],
        "runtime": 142,
        "posterUrl": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        "createdBy": userId
    },
    {
        "title": "Parasite",
        "overview": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        "releaseYear": 2019,
        "genres": ["Comedy", "Drama", "Thriller"],
        "runtime": 132,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        "createdBy": userId
    },
    {
        "title": "The Matrix",
        "overview": "A computer hacker discovers that reality as he knows it is a simulation run by machines, and joins a rebellion to free humanity.",
        "releaseYear": 1999,
        "genres": ["Action", "Sci-Fi"],
        "runtime": 136,
        "posterUrl": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        "createdBy": userId
    },
    {
        "title": "Pulp Fiction",
        "overview": "The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption in Los Angeles.",
        "releaseYear": 1994,
        "genres": ["Crime", "Drama"],
        "runtime": 154,
        "posterUrl": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        "createdBy": userId
    },
    {
        "title": "Forrest Gump",
        "overview": "The history of the United States from the 1950s to the 1970s unfolds through the perspective of an Alabama man with a low IQ who witnesses and inadvertently influences several defining historical events.",
        "releaseYear": 1994,
        "genres": ["Drama", "Romance"],
        "runtime": 142,
        "posterUrl": "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        "createdBy": userId
    },
    {
        "title": "Dune: Part One",
        "overview": "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset, a mind-enhancing drug called spice, found only on a desert planet.",
        "releaseYear": 2021,
        "genres": ["Adventure", "Drama", "Sci-Fi"],
        "runtime": 155,
        "posterUrl": "https://image.tmdb.org/t/p/w500/d5NXSklpcuveaZqgLXPdmLP8Gu.jpg",
        "createdBy": userId
    },
    {
        "title": "Everything Everywhere All at Once",
        "overview": "A middle-aged Chinese-American woman is swept up in an outlandish adventure where she alone can save the world by exploring other universes connecting with the lives she could have led.",
        "releaseYear": 2022,
        "genres": ["Action", "Adventure", "Comedy", "Sci-Fi"],
        "runtime": 139,
        "posterUrl": "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
        "createdBy": userId
    }
];

const main = async () => {
    console.log("Seeding movies...")

    for (const movie of movies) {
        await prisma.movie.create({
            data: movie,
        });
        console.log(`Created Movie : ${movie.title}`)
    }

    console.log("Seeding Completed!")
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
    await pool.end();
})