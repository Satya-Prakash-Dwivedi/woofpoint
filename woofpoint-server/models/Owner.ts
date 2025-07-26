import mongoose, { Document, Schema } from 'mongoose';

export interface IDogOwner extends Document {
    userId: mongoose.Types.ObjectId;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
    dogs: Array<{
        name: string;
        breed: string;
        age: number;
        size: 'small' | 'medium' | 'large';
        photos: string[];
    }>;
    bookingHistory: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const DogOwnerSchema: Schema<IDogOwner> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    dogs: [{
        name: { type: String, required: true },
        breed: { type: String, required: true },
        age: { type: Number, required: true },
        size: { type: String, enum: ['small', 'medium', 'large'], required: true },
        photos: [{ type: String }]
    }],
    bookingHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    timestamps: true
});

export default mongoose.model<IDogOwner>('DogOwner', DogOwnerSchema);
