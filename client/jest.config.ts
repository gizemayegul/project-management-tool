// jest.config.js
export default {
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/node_modules/jest-canvas-mock"],
  preset: "ts-jest",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
