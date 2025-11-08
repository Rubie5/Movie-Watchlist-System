// jest.config.cjs
module.exports = {
  // Use Node environment for API route testing
  testEnvironment: 'node',

  // Transform JS/TS files using Babel (Next.js preset)
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Resolve @/ aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Transform certain node_modules packages (like Mongoose)
  transformIgnorePatterns: [
    '/node_modules/(?!(bson|mongodb|mongoose)/)',
  ],

  // Automatically load your test setup file before each test suite
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Optional: patterns for test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Clear mocks between tests automatically
  clearMocks: true,
};
