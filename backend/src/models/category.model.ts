import mongoose, { type Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
