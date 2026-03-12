import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const userRegisterController = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const isexistmail = await User.findOne({ email: email });
        if (isexistmail) {
            return res.status(400).json({ message: "User already exist with this mail" });
        }
        const user = await User.create({
            email, password, name
        })

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token);

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Email or password is INVALID" });
        }

        const isvalidpass = await user.comparepassword(password);

        if (!isvalidpass) {
            return res.status(401).json({ message: "Email or password is INVALID" })
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token);

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default {userRegisterController,userLoginController};