import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export const Exercise = mongoose.model("Exercise", ExerciseSchema);