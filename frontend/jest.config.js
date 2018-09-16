module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleNameMapper": {
    "\\.(css|scss|sass)$": "<rootDir>/__mocks__/styleMock.js"
  },
  "setupTestFrameworkScriptFile": "<rootDir>src/setupTests.tsx",
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "\\.d.ts$",
    "src/index.tsx",
    "setupTests.tsx"
  ],
  "testURL": "http://localhost",
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};
