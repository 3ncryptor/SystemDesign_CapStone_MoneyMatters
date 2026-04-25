import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IMonthlyPlan extends Document {
  userId: Types.ObjectId;
  month: number;
  year: number;
  savingGoal: number;
  achievedSavings: number;
  goalMet: boolean;
  isClosed: boolean;
}

const monthlyPlanSchema: Schema<IMonthlyPlan> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    savingGoal: {
      type: Number,
      required: true,
    },
    achievedSavings: {
      type: Number,
      default: 0,
    },
    goalMet: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

monthlyPlanSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const MonthlyPlan = mongoose.model<IMonthlyPlan>("MonthlyPlan", monthlyPlanSchema);
