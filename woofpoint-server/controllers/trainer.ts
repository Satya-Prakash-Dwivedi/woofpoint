// trainer.ts (Corrected and working code)

import User from "../models/user.model";
import Trainer from "../models/trainer.model";

export const getTrainerProfile = async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).lean();
        const trainer = await Trainer.findOne({ userId }).lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Combine user data with nested trainer data for the frontend
        const profile = {
            ...user,
            bio: trainer?.portfolio?.bio || "",
            specialization: trainer?.portfolio?.specializations?.[0] || "", // Sending the first specialization
            experience: trainer?.businessInfo?.yearsOfExperience?.toString() || "0",
        };

        res.json(profile);
    } catch (err) {
        console.error("Error fetching trainer profile:", err);
        res.status(500).json({ error: "Server error while fetching profile" });
    }
};


export const updateTrainerProfile = async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phone, zipCode, specialization, bio, experience } = req.body;

        // 1. Update the User model
        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, phone, zipCode },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Prepare the update object for the Trainer model using dot notation
        const trainerUpdateData = {
            'portfolio.bio': bio,
            // Your schema expects an array of strings for specializations
            'portfolio.specializations': specialization ? [specialization] : [],
            // Your schema uses 'yearsOfExperience' and it's a number
            'businessInfo.yearsOfExperience': Number(experience) || 0
        };

        // 3. Update the Trainer model
        const trainer = await Trainer.findOneAndUpdate(
            { userId },
            { $set: trainerUpdateData }, // Use $set to update nested fields
            { new: true, upsert: true } // upsert: true creates the document if it doesn't exist
        );

        res.json({ user, trainer });
    } catch (err) {
        console.error("Error updating trainer profile:", err);
        res.status(500).json({ error: "Server error while updating profile" });
    }
};