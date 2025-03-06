const request = require("supertest");
const { expect } = require("chai");
const app = require("../../server"); // Express app entry point
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

before(async function () {
  this.timeout(10000); // Increase timeout for DB setup

  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async function () {
  await User.deleteMany();
});

after(async function () {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User API Integration Tests", function () {
  it("should sign up a new user", async function () {
    const res = await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123!",
    });

    //console.log("Signup response:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("should log in an existing user", async function () {
    // First, sign up the user
    await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123!",
    });

    // Now, log in the user
    const res = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "Password123!",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("should not log in with incorrect credentials", async function () {
    // First, sign up the user
    await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123!",
    });

    // Attempt to log in with incorrect password
    const res = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "Wrongpassword!",
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error", "Incorrect password");
  });
});
