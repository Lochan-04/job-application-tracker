import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    salaryRange: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["wishlist", "applied", "screening", "interview", "offer", "rejected"],
      default: "applied"
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time"
    },
    source: { type: String, default: "", trim: true },
    applicationLink: { type: String, default: "", trim: true },
    contactName: { type: String, default: "", trim: true },
    contactEmail: { type: String, default: "", trim: true },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium"
    },
    resumeVersion: { type: String, default: "", trim: true },
    nextStep: { type: String, default: "", trim: true },
    lastContactedOn: { type: Date, default: null },
    dateApplied: { type: Date, required: true },
    followUpDate: { type: Date, default: null },
    notes: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ user: 1, updatedAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
