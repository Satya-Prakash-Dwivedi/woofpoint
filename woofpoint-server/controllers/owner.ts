import { Request, Response } from "express";
import DogOwner from "../models/owner.model";
import User from "../models/user.model";

/**
 * GET /owners/:userId
 * Fetch combined user + dogOwner profile
 */
export const getOwnerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const dogOwner = await DogOwner.findOne({ userId });
        if (!dogOwner) return res.status(404).json({ message: "DogOwner profile not found" });

        return res.json({
            ...user.toObject(),
            ...dogOwner.toObject(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * PUT /owners/:userId
 * Update profile details
 */
export const updateOwnerProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, phone, profilePhoto, location, dogs } = req.body;

        // Update User collection
        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, phone, profilePhoto },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Update DogOwner collection
        const dogOwner = await DogOwner.findOneAndUpdate(
            { userId },
            { location, dogs },
            { new: true, upsert: true } // create if not exists
        );

        return res.json({
            ...user.toObject(),
            ...dogOwner?.toObject(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
