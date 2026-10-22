import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: String,
    filename: String,
    mimetype: String,
    size: Number,
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);