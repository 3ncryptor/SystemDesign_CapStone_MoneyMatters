import jwt from "jsonwebtoken";
import { authMiddleware } from "../../src/middlewares/auth.middleware";
import { ApiError } from "../../src/utils/ApiError";

jest.mock("jsonwebtoken");

const mockRequest = (authHeader?: string) => ({
  headers: {
    authorization: authHeader,
  },
  user: undefined,
});

const mockResponse = () => ({});

const mockNext = jest.fn();

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() and attach user for a valid token", () => {
    const decoded = { userId: "user123" };
    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    const req = mockRequest("Bearer valid_token");

    authMiddleware(req as any, mockResponse() as any, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("valid_token", process.env.JWT_SECRET);
    expect(req.user).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should throw ApiError(401) if Authorization header is missing", () => {
    const req = mockRequest(undefined);

    expect(() => authMiddleware(req as any, mockResponse() as any, mockNext)).toThrow(ApiError);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw ApiError(401) if Authorization header does not start with Bearer", () => {
    const req = mockRequest("Basic some_token");

    expect(() => authMiddleware(req as any, mockResponse() as any, mockNext)).toThrow(ApiError);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw ApiError(401) if token is invalid or expired", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = mockRequest("Bearer expired_token");

    expect(() => authMiddleware(req as any, mockResponse() as any, mockNext)).toThrow(ApiError);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
