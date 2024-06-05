import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    tags: { type: [String], default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // This will add `createdAt` and `updatedAt` fields
  }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
