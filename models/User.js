import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["freelancer", "client", "admin"],
      required: true,
    },
    // Common fields for all users
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    // Fields specific to clients
    companyName: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    // Fields specific to freelancers
    skills: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    // Job relationships
    postedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    }],
    appliedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    }],
    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    }],
  },
  { timestamps: true }
);

// Create indexes for faster querying
userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ name: 'text', companyName: 'text', bio: 'text' });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;