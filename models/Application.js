import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Accepted"],
      default: "Pending",
    },
    clientNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create indexes for faster querying
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ client: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;