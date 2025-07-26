import catchAsyncErrors from './catchAsyncErrors.js';
import jwt from 'jsonwebtoken';
import { connectDB } from "../lib/mongodb.js";
import { User } from '../models/user.js'

const secret = process.env.JWT_SECRET

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        // return res.status(401).json({ message: "Login first to access this resource" });
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, secret);

        await connectDB();
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
})

// Handling user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send({
                message: `Role (${req.user.role}) is not allowed to access this resource.`
            });
        }
        next()
    }
}



export {
    isAuthenticatedUser,
    authorizeRoles,
}

