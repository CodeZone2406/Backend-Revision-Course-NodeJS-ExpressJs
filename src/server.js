const express = require('express');
const { config } = require('dotenv');
config();
const { connectDB, disconnectDB } = require('./config/db');

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const watchlistRoute = require('./routes/watchlistRoute')

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchList", watchlistRoute)

const port = process.env.PORT || 5001

const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on PORT ${port}`);
});

process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection : ", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception : ", err);
    await disconnectDB();
    process.exit(1);
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM Received, shutting down gracefully!");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});