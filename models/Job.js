import mongoose from "mongoose";

// Job Schema
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      required: true,
    },
    experience: {
      type: String,
      enum: ["Entry", "Intermediate", "Senior", "Expert"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for faster querying
jobSchema.index({ title: 'text', company: 'text', skills: 'text' });
jobSchema.index({ client: 1 });
jobSchema.index({ status: 1 });

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;