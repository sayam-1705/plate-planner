import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Interface representing a User document in MongoDB
 * Extends Document to include Mongoose document methods
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
      index: true, // Add index for better query performance
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Hide password field by default
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Method to compare a provided password with the stored hashed password
 * @param candidatePassword - The password to verify
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // We need to get the password field explicitly since select: false is set
    const user = await mongoose
      .model("User")
      .findById(this._id)
      .select("+password");
    if (!user || !user.password) return false;

    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Create or retrieve the User model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
