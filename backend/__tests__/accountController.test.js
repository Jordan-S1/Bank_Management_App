const accountController = require("../controllers/accountController");
const Account = require("../models/accountModel");
const httpMocks = require("node-mocks-http");
const mongoose = require("mongoose");

// Mock the Account model
jest.mock("../models/accountModel");

describe("Account Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get All Accounts", () => {
    it("should return all accounts for a user", async () => {
      const req = httpMocks.createRequest({
        user: { _id: "user123" },
      });
      const res = httpMocks.createResponse();

      Account.find = jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue([
          {
            _id: "1",
            acc_name: "Business",
            acc_type: "Savings",
            balance: 3000,
          },
          {
            _id: "2",
            acc_name: "Personal",
            acc_type: "Current",
            balance: 1000,
          },
        ]),
      }));

      await accountController.getAccounts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([
        { _id: "1", acc_name: "Business", acc_type: "Savings", balance: 3000 },
        { _id: "2", acc_name: "Personal", acc_type: "Current", balance: 1000 },
      ]);
    });
  });

  describe("Get Single Account", () => {
    it("should return a specific account", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66a9949c468dde0ff047cc76" },
      });
      const res = httpMocks.createResponse();

      Account.findById = jest.fn().mockResolvedValue({
        _id: "66a9949c468dde0ff047cc76",
        acc_name: "Checking",
      });

      await accountController.getAccount(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: "66a9949c468dde0ff047cc76",
        acc_name: "Checking",
      });
    });

    it("should return 404 for an invalid account ID", async () => {
      const req = httpMocks.createRequest({ params: { id: "invalid123" } });
      const res = httpMocks.createResponse();

      Account.findById = jest.fn().mockResolvedValue(null);

      await accountController.getAccount(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });

    it("should return 404 for a non-existent account ID", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66a9949c468dde0ff047cc76" },
      });
      const res = httpMocks.createResponse();

      Account.findById = jest.fn().mockResolvedValue(null);

      await accountController.getAccount(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });
  });

  describe("Create Account", () => {
    it("should create a new account", async () => {
      const req = httpMocks.createRequest({
        body: { acc_name: "New Account", acc_type: "Business", balance: 5000 },
        user: { _id: "user123" },
      });
      const res = httpMocks.createResponse();

      Account.create = jest.fn().mockResolvedValue({
        _id: "new123",
        acc_name: "New Account",
        acc_type: "Business",
        balance: 5000,
        user_id: "user123",
      });

      await accountController.createAccount(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: "new123",
        acc_name: "New Account",
        acc_type: "Business",
        balance: 5000,
        user_id: "user123",
      });
    });

    it("should return an error if required fields are missing", async () => {
      const req = httpMocks.createRequest({
        body: { acc_name: "" },
        user: { _id: "user123" },
      });
      const res = httpMocks.createResponse();

      await accountController.createAccount(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "Please fill in all fields",
        emptyFields: ["acc_name", "acc_type"],
      });
    });

    it("should return 400 if there is a database error during account creation", async () => {
      const req = httpMocks.createRequest({
        body: {
          acc_name: "New Account",
          acc_number: "123456789",
          acc_type: "Savings",
          balance: 5000,
        },
        user: { _id: "user123" },
      });
      const res = httpMocks.createResponse();

      // Mock Account.create to throw an error
      Account.create = jest.fn().mockRejectedValue(new Error("Database error"));

      await accountController.createAccount(req, res);

      // Assert that the response status is 400
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: "Database error" });
    });
  });

  describe("Delete Account", () => {
    it("should delete an account", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66adc6d823ff9e638ae1a823" },
      });
      const res = httpMocks.createResponse();

      Account.findOneAndDelete = jest
        .fn()
        .mockResolvedValue({ _id: "66adc6d823ff9e638ae1a823" });

      await accountController.deleteAccount(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ _id: "66adc6d823ff9e638ae1a823" });
    });

    it("should return 404 for an invalid account ID", async () => {
      const req = httpMocks.createRequest({ params: { id: "invalid123" } });
      const res = httpMocks.createResponse();

      Account.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await accountController.deleteAccount(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });

    it("should return 400 if account does not exist", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66a9b2bedcc7791b6179efcd" },
      });
      const res = httpMocks.createResponse();

      Account.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await accountController.deleteAccount(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });
  });

  describe("Update Account", () => {
    it("should update an account", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66a9b2bedcc7791b6179efcd" },
        body: { acc_name: "Updated Name" },
      });
      const res = httpMocks.createResponse();

      Account.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: "66a9b2bedcc7791b6179efcd",
        acc_name: "Updated Name",
      });

      await accountController.updateAccount(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: "66a9b2bedcc7791b6179efcd",
        acc_name: "Updated Name",
      });
    });

    it("should return 404 for an invalid account ID", async () => {
      const req = httpMocks.createRequest({
        params: { id: "invalid123" },
        body: { acc_name: "Updated Name" },
      });
      const res = httpMocks.createResponse();

      Account.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await accountController.updateAccount(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });

    it("should return 400 if account does not exist", async () => {
      const req = httpMocks.createRequest({
        params: { id: "66a9b32ddcc7791b6179efe1" },
        body: { acc_name: "Updated Name" },
      });
      const res = httpMocks.createResponse();

      Account.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await accountController.updateAccount(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: "No such account" });
    });
  });
});
