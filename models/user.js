import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            // required: [true, "Email is required"],
            // unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            // required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: [true, "Role is required"],
        },
        name: {

            type: String,
            default: "",
        },
        mobile: {
            type: String,
            default: "",
        },
        imageName: {
            type: String,
            default: "",
        },
        providerId: {
            type: String,
            default: "",
            index: true,
        },
        provider: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema, "users");
