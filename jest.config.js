/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['html', 'lcov'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
