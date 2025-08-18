import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken"
import User from "../models/user";
import s3 from "../utils/s3";

require('dotenv').config();

interface AuthRequest extends Request {
    user?: { id: string; role?: string };
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, phone, zipCode } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = new User({
            email,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            phone,
            zipCode,
        });

        await user.save();

        // sign jwt token - FIXED: Make consistent with login
        const token = jwt.sign(
            {
                _id: user._id,      // Changed from 'id' to '_id' to match login
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return res.status(201).json({ token });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

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

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
    try {

        console.log('Upload photo started');
        console.log('User:', req.user);
        console.log('File:', req.file ? 'File received' : 'No file');

        if (!req.user?.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { mimetype, originalname, buffer } = req.file;
        const key = `profile-photos/${req.user.id}-${Date.now()}-${originalname || "photo.jpg"}`;

        // Upload file to S3 with the file buffer
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer, // This was missing in your original code!
            ContentType: mimetype,
            // ACL: "public-read", // Uncomment if you want public access
        });

        await s3.send(command);

        // Construct the public URL
        const photoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Update user profilePhoto in MongoDB
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePhoto: photoUrl },
            { new: true, projection: "-password" }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Profile photo uploaded successfully",
            photoUrl,
            user,
        });
    } catch (err) {
        console.error("uploadPhoto error:", err);
        return res.status(500).json({
            error: "Server error",
            details: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
        });
    }
};
