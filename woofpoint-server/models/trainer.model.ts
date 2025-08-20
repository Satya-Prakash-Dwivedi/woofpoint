import mongoose, { Document, Schema } from 'mongoose';

export interface IDogTrainer extends Document {
    userId: mongoose.Types.ObjectId;
    businessInfo?: {
        businessName?: string;
        licenseNumber?: string;
        yearsOfExperience: number;
        certifications: Array<{
            name?: string;
            issuedBy?: string;
            issuedDate?: Date;
            expiryDate?: Date;
        }>;
    };
    services: Array<{
        type?: string;
        description?: string;
        duration?: number;
        price?: number;
        isActive: boolean;
    }>;
    location?: {
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
    availability?: {
        schedule: Array<{
            day?: string;
            startTime?: string;
            endTime?: string;
            isAvailable: boolean;
        }>;
        timeZone?: string;
    };
    ratings: {
        averageRating: number;
        totalReviews: number;
    };
    portfolio?: {
        bio?: string;
        specializations: string[];
        photos: string[];
    };
    isVerified: boolean;
    bookingHistory: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const DogTrainerSchema: Schema<IDogTrainer> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessInfo: {
        businessName: { type: String, default: "" },
        licenseNumber: { type: String, default: "" },
        yearsOfExperience: { type: Number, default: 0 },
        certifications: [{
            name: { type: String, default: "" },
            issuedBy: { type: String, default: "" },
            issuedDate: { type: Date, default: null },
            expiryDate: { type: Date, default: null }
        }]
    },
    services: [{
        type: { type: String, default: "" },
        description: { type: String, default: "" },
        duration: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    }],
    location: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
    },
    availability: {
        schedule: [{
            day: { type: String, default: "" },
            startTime: { type: String, default: "" },
            endTime: { type: String, default: "" },
            isAvailable: { type: Boolean, default: true }
        }],
        timeZone: { type: String, default: "" }
    },
    ratings: {
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 }
    },
    portfolio: {
        bio: { type: String, default: "" },
        specializations: [{ type: String }],
        photos: [{ type: String }]
    },
    isVerified: { type: Boolean, default: false },
    bookingHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IDogTrainer>('DogTrainer', DogTrainerSchema);
