module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
    collectCoverage: false,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    moduleNameMapper: {
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@model/error$': '<rootDir>/src/util/validation-error.ts',
        '^@firebase/db$': '<rootDir>/src/repository/index.ts',
    },
};
