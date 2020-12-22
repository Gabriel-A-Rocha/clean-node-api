module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*-protocols.ts",
    "!**/protocols/**",
  ],
  coverageDirectory: "coverage",
  preset: "@shelf/jest-mongodb",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  // watchPathIgnorePatterns: ["globalConfig"],
};
