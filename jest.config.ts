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
        '^@controllers/(.*)$': '<rootDir>/src/controller/$1',
        '^@models/(.*)$': '<rootDir>/src/domain/models/$1',
        '^@services$': '<rootDir>/src/domain/services/index.ts',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@exceptions$': '<rootDir>/src/domain/exceptions/index.ts',
        '^@firebase/db$': '<rootDir>/src/repository/index.ts',
    },
};
