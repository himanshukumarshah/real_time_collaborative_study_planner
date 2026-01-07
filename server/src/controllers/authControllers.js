import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const userRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (name.length < 3 || name.length > 20) {
            return res.status(400).json({ 
                message: "Name must be between 3 and 20 characters." 
            });
        }

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new User({
            name,
            email,
            password: hashedPassword
        }).save();

        res.status(201).json({
            message: "User registered successfully!",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.error("Error in auth/register: ", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body; 

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        
        res.status(200).json({
            message: "Login successful!",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.error("Error in auth/login:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};