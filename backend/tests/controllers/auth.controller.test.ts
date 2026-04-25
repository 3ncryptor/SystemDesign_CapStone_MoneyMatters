import { mockUser } from "../mocks/user.mock";

const mockRegister = jest.fn();
const mockLogin = jest.fn();

jest.mock("../../src/services/auth.service", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    register: mockRegister,
    login: mockLogin,
  })),
}));

jest.mock("../../src/repositories/user.repository", () => ({
  UserRepository: jest.fn(),
}));

import { AuthController } from "../../src/controllers/auth.controller";

const mockRequest = (body: any = {}) => ({
  body,
});

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();
const flushPromises = () => new Promise((resolve) => process.nextTick(resolve));

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 201 with the created user", async () => {
      mockRegister.mockResolvedValue(mockUser);
      const req = mockRequest({ name: "Test", email: "test@example.com", password: "pass" });
      const res = mockResponse();

      AuthController.register(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockRegister).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "User registered successfully",
          data: mockUser,
        }),
      );
    });

    it("should call next with error if registration fails", async () => {
      const error = new Error("Registration failed");
      mockRegister.mockRejectedValue(error);
      const req = mockRequest({ name: "Test", email: "test@example.com", password: "pass" });
      const res = mockResponse();

      AuthController.register(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should return 200 with user and token", async () => {
      const loginResult = { user: mockUser, token: "mock_token" };
      mockLogin.mockResolvedValue(loginResult);
      const req = mockRequest({ email: "test@example.com", password: "pass" });
      const res = mockResponse();

      AuthController.login(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "pass");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Login successful",
          data: loginResult,
        }),
      );
    });

    it("should call next with error if login fails", async () => {
      const error = new Error("Login failed");
      mockLogin.mockRejectedValue(error);
      const req = mockRequest({ email: "test@example.com", password: "wrong" });
      const res = mockResponse();

      AuthController.login(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
