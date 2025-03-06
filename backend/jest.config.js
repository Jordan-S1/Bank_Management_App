module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 20000, // 20 seconds
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/integration/"], // Ignore integration tests
};
