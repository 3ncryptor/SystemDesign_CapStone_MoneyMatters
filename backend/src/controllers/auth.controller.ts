import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const service = new AuthService(new UserRepository());

export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const user = await service.register(req.body);

    res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await service.login(email, password);

    res.status(200).json(new ApiResponse(200, result, "Login successful"));
  });
}
