import bcrypt from "bcrypt"
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import User from "../models/user";

export const signup = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, role, phone, zipCode } = req.body;
    const profilePhoto = (req.file as any)?.location;  // multer-s3 puts URL in location

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
            role: role || 'owner', // default role is owner
            profilePhoto,
            phone,
            zipCode,
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
            profilePhoto: user.profilePhoto,
            phone: user.phone,
            zipCode: user.zipCode,
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

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        console.log('Login endpoint hit');
        console.log('Request body:', req.body);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Clean and normalize email
        const cleanEmail = email.toLowerCase().trim();

        console.log('Searching for user with email:', cleanEmail);

        // Find user by email
        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            console.log('User not found with email:', cleanEmail);
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        console.log('User found:', {
            id: user._id,
            email: user.email,
            hasPassword: !!user.password
        });

        // Clean password (remove any whitespace)
        const cleanPassword = password.trim();

        console.log('Comparing passwords...');
        console.log('Input password length:', cleanPassword.length);
        console.log('Stored password hash length:', user.password.length);

        // Compare password
        const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Password validation failed');
            return res.status(401).json({  // Changed from 403 to 401
                error: "Invalid email or password"  // Changed to generic message for security
            });
        }

        console.log('Password validated successfully');

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        // Don't send password in response
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        console.log('Login successful for user:', user.email);

        res.status(200).json({
            user: userResponse,
            token,
            message: "Login successful"
        });

    } catch (error: any) {
        console.error('Login error:', error);

        res.status(500).json({
            error: "Login failed",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}