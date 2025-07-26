import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    role: 'owner' | 'trainer';
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['owner', 'trainer'],
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

export default mongoose.model<IUser>('User', UserSchema);