const jwt = require("jsonwebtoken")
const { prisma } = require("../config/db.js")

// Read the token from the request
// Check the vailidity of the token
const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware reached");
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]; // ["Bearer", "MY_SECRET_TOKEN"]
    } else if (req.cookies?.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return res.status(401).json({ error : "Not auhtorized, no token provided"})
    }

    try {
        // Verify the token is valid and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where : { id: decoded.id },
        });

        if(!user){
            return res.status(401).json({ error : "Not authorized, no token provided"})
        }

        req.user = user;
        next(); // Move Forward with the request
    } catch (err){
        return res.status(401).json({ error : `Not authorized, no token provided ${err}`})
    }

}

module.exports = { authMiddleware }
