const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/userModel");

jest.mock("bcrypt");
jest.mock("validator");

describe("User Model", () => {
  beforeEach(() => {
    // Mock Mongoose methods to avoid real database interactions
    User.findOne = jest.fn();
    User.create = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should throw an error if any field is missing", async () => {
      await expect(User.signup()).rejects.toThrow("All fields must be filled");
    });

    it("should throw an error if email is not valid", async () => {
      validator.isEmail.mockReturnValue(false);
      await expect(
        User.signup("John", "invalidemail", "Password123!")
      ).rejects.toThrow("Email not valid");
    });

    it("should throw an error if password is not strong enough", async () => {
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(false);
      await expect(
        User.signup("John", "test@test.com", "12345")
      ).rejects.toThrow("Password not strong enough");
    });

    it("should throw an error if the email already exists", async () => {
      // Mock dependencies
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      User.findOne.mockResolvedValue({
        name: "Existing User",
        email: "test@test.com",
        password: "hashedPassword",
      }); // Simulate existing user

      // Call the signup method and assert the error is thrown
      await expect(
        User.signup("John", "test@test.com", "Password123!")
      ).rejects.toThrow("Email already in use");

      // Verify `findOne` is called
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    });

    it("should hash the password and create a user", async () => {
      // Mock dependencies
      validator.isEmail.mockReturnValue(true);
      validator.isStrongPassword.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.findOne.mockResolvedValue(null); // Simulate no existing user
      User.create.mockResolvedValue({
        name: "John",
        email: "test@test.com",
        password: "hashedPassword",
      });

      // Call the signup method
      const user = await User.signup("John", "test@test.com", "Password123!");

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("Password123!", "salt");
      expect(User.create).toHaveBeenCalledWith({
        name: "John",
        email: "test@test.com",
        password: "hashedPassword",
      });
      expect(user).toEqual({
        name: "John",
        email: "test@test.com",
        password: "hashedPassword",
      });
    });
  });

  describe("login", () => {
    it("should throw an error if any field is missing", async () => {
      await expect(User.login()).rejects.toThrow("All fields must be filled");
    });

    it("should throw an error for incorrect email", async () => {
      User.findOne.mockResolvedValue(null); // Simulate no user found

      await expect(User.login("test@test.com", "Password123!")).rejects.toThrow(
        "Incorrect email"
      );
    });

    it("should throw an error for incorrect password", async () => {
      User.findOne.mockResolvedValue({ password: "hashedPassword" });
      bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

      await expect(
        User.login("test@test.com", "wrongPassword")
      ).rejects.toThrow("Incorrect password");
    });

    it("should return user for correct credentials", async () => {
      const mockUser = {
        name: "John",
        email: "test@test.com",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(mockUser); // Simulate user found
      bcrypt.compare.mockResolvedValue(true); // Simulate password match

      const user = await User.login("test@test.com", "Password123!");

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Password123!",
        "hashedPassword"
      );
      expect(user).toEqual(mockUser);
    });
  });
});
