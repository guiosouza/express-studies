import mongoose from "mongoose";

const TrainingDaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500, 
  },
  exerciseType: {
    type: String,
    enum: ["fight", "aerobic", "weightlifting"], 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TrainingDay = mongoose.model("TrainingDay", TrainingDaySchema);
