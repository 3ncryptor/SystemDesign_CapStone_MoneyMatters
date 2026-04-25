import { Category, type ICategory } from "../models/category.model.js";

export class CategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return Category.find();
  }
}
