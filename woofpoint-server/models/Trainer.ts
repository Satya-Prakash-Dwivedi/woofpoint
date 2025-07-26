import mongoose, { Document, Schema } from 'mongoose';

export interface IDogTrainer extends Document {
    userId: mongoose.Types.ObjectId;
    businessInfo: {
        businessName?: string;
        licenseNumber?: string;
        yearsOfExperience: number;
        certifications: Array<{
            name: string;
            issuedBy: string;
            issuedDate: Date;
            expiryDate?: Date;
        }>;
    };
    services: Array<{
        type: string;
        description: string;
        duration: number; // in minutes
        price: number;
        isActive: boolean;
    }>;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
    availability: {
        schedule: Array<{
            day: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }>;
        timeZone: string;
    };
    ratings: {
        averageRating: number;
        totalReviews: number;
    };
    portfolio: {
        bio: string;
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
        businessName: { type: String },
        licenseNumber: { type: String },
        yearsOfExperience: { type: Number, required: true, min: 0 },
        certifications: [{
            name: { type: String, required: true },
            issuedBy: { type: String, required: true },
            issuedDate: { type: Date, required: true },
            expiryDate: { type: Date }
        }]
    },
    services: [{
        type: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
    }],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    availability: {
        schedule: [{
            day: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isAvailable: { type: Boolean, default: true }
        }],
        timeZone: { type: String, required: true }
    },
    ratings: {
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 }
    },
    portfolio: {
        bio: { type: String, maxlength: 1000 },
        specializations: [{ type: String }],
        photos: [{ type: String }],
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
