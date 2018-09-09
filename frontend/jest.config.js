module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "collectCoverage": true,
  "coveragePathIgnorePatterns": [
    // Ignored because it has a bunch of really long arrays.
    "card_formatter.tsx"
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
