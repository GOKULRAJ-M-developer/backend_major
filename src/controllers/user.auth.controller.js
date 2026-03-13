import  User  from "../models/user.model.js";
import jwt from "jsonwebtoken";
import emailService from "../services/email.service.js";

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
     await emailService.sendRegistrationEmail(user.email,user.name);   

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
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

export default {userRegisterController,userLoginController,userLogoutController};