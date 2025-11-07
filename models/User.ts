
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "agent";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "agent"], default: "agent" },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
