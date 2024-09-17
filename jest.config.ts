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
        '^@controllers$': '<rootDir>/src/infrastructure/controllers/index.ts',
        '^@entities$': '<rootDir>/src/domain/entities/index.ts',
        '^@exceptions$': '<rootDir>/src/domain/exceptions/index.ts',
        '^@services$': '<rootDir>/src/domain/services/index.ts',
        '^@use-cases$': '<rootDir>/src/application/use_cases/index.ts',
        '^@middlewares$': '<rootDir>/src/infrastructure/middlewares/index.ts',
        '^@constants$': '<rootDir>/src/constants',
        '^@firebase/config$': '<rootDir>/src/infrastructure/config/firebase-config.ts',
        '^@firebase/repository$': '<rootDir>/src/infrastructure/db/firebase-journey-repository.ts'
    },
};
