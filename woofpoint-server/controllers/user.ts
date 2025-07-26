import bcrypt from "bcrypt"
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import User from "../models/user";
import { error } from "console";

export const signup = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, role } = req.body;

    try {

        // First check if user already exists or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: "User with this email already exists"
            })
        }
        // Hash the password
        const hashed = await bcrypt.hash(password, 10);
        // Create User with all the required fields
        const user = await User.create({
            email,
            password: hashed,
            firstName,
            lastName,
            role: role || 'owner' // default role is owner
        });

        const token = jwt.sign(     // Payload will containe user id and role
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' });

        const userResponse = {     // Here we exclude password from response, only send safe user data back to client
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        res.status(201).json({
            user: userResponse,
            token,
            message: "User created successfully"
        })
    } catch (error: any) {
        console.error('Signup error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Email already exists in database"
            });
        }


        // Handle Mongoose validation errors like missing fields and invalid data
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: "Validation failed",
                details: Object.values(error.errors).map((err: any) => err.message)
            });
        }

        res.status(500).json({       // Internal server error, shows error details in development for security
            error: "Signup failed",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });


    }
}