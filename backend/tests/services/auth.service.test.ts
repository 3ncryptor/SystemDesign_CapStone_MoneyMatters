import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/auth.service";
import { ApiError } from "../../src/utils/ApiError";
import { mockUser, mockUserInput } from "../mocks/user.mock";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUserRepo = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockUserRepo as any);
  });

  describe("register", () => {
    it("should create a user with a hashed password", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockUserRepo.create.mockResolvedValue(mockUser);

      const result = await service.register(mockUserInput);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(mockUserInput.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        ...mockUserInput,
        password: "hashed_password",
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw ApiError(400) if email already exists", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(mockUserInput)).rejects.toThrow(ApiError);
      await expect(service.register(mockUserInput)).rejects.toThrow("User already exists");
    });
  });

  describe("login", () => {
    it("should return user and token for valid credentials", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock_token");

      const result = await service.login("test@example.com", "password");

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password", mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      expect(result).toEqual({ user: mockUser, token: "mock_token" });
    });

    it("should throw ApiError(404) if user not found", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login("notfound@example.com", "pass")).rejects.toThrow(ApiError);
      await expect(service.login("notfound@example.com", "pass")).rejects.toThrow("User not found");
    });

    it("should throw ApiError(401) if password is incorrect", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login("test@example.com", "wrong")).rejects.toThrow(ApiError);
      await expect(service.login("test@example.com", "wrong")).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });
});
