const userController = require("../controllers/userController");
const User = require("../models/userModel");
const httpMocks = require("node-mocks-http");
const jwt = require("jsonwebtoken");

// Mock Mongoose model and JWT
jest.mock("../models/userModel");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Signup User", () => {
    it("should create a new user and return a token", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          name: "John",
          email: "john@example.com",
          password: "password123",
        },
      });

      const res = httpMocks.createResponse();

      User.signup = jest.fn().mockResolvedValue({
        _id: "123",
        name: "John",
        email: "john@example.com",
      });

      await userController.signupUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        name: "John",
        email: "john@example.com",
        token: "mocked_token",
      });
    });

    it("should return an error if signup fails", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { name: "", email: "invalidemail", password: "" },
      });

      const res = httpMocks.createResponse();

      User.signup = jest.fn().mockRejectedValue(new Error("Invalid user data"));

      await userController.signupUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: "Invalid user data" });
    });
  });

  describe("Login User", () => {
    it("should log in a user and return a token", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { email: "john@example.com", password: "password123" },
      });

      const res = httpMocks.createResponse();

      User.login = jest.fn().mockResolvedValue({
        _id: "123",
        name: "John",
        email: "john@example.com",
      });

      await userController.loginUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        name: "John",
        email: "john@example.com",
        token: "mocked_token",
      });
    });

    it("should return an error if login fails", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { email: "wrong@example.com", password: "wrongpassword" },
      });

      const res = httpMocks.createResponse();

      User.login = jest
        .fn()
        .mockRejectedValue(new Error("Invalid credentials"));

      await userController.loginUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: "Invalid credentials" });
    });
  });
});
