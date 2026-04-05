const { prisma } = require("../config/db.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken.js");

const registerController = async (req, res) => {
    const { name, email, password } = req.body;


    // console.log("Searching for email:", email);
    const userExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists with this email" })
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create User
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    const token = generateToken(user.id, res)
    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
            },
            token,
        },
    });
};


// JWT - JSON Web Tokens -> Allow to verify the user 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!userExists) {
        return res
            .status(401)
            .json({ error: "Invalid email or password" })
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ error: "Invalid email or password" })
    }

    // Generate JWT Token
    const token = generateToken(userExists.id, res)

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: userExists.id,
                email: email,
            },
            token,
        },
    });
}

const logoutUser = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
        status: "success",
        messgae: "Logged Out Successfully"
    });
};

module.exports = { registerController, loginUser, logoutUser }

// Data will be sent through the body of the request