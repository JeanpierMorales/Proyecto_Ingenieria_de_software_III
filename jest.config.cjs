module.exports = {
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!supertest|express|cors|mysql2)/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testPathIgnorePatterns: ["node_modules/"],
  setupFilesAfterEnv: [],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
