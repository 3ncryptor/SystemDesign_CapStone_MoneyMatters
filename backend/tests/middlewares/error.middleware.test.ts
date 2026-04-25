import { errorMiddleware } from "../../src/middlewares/error.middleware";
import { ApiError } from "../../src/utils/ApiError";

const mockRequest = () => ({});

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("errorMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct status code and message for an ApiError", () => {
    const err = new ApiError(400, "Bad Request");
    const res = mockResponse();

    errorMiddleware(err, mockRequest() as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Bad Request",
    });
  });

  it("should return 401 for an unauthorized ApiError", () => {
    const err = new ApiError(401, "Unauthorized");
    const res = mockResponse();

    errorMiddleware(err, mockRequest() as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });

  it("should return 500 for a generic Error", () => {
    const err = new Error("Something broke");
    const res = mockResponse();

    errorMiddleware(err, mockRequest() as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});
