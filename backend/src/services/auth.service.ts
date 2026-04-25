import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { UserRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ApiError(400, "User already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { user, token };
  }
}
