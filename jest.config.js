module.exports = {
  // Environnement de test
  testEnvironment: 'jsdom',
  
  // Dossiers à tester
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Dossiers à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Configuration des collecteurs de couverture
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Répertoires de couverture
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Configuration des mocks
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Configuration des reporters
  reporters: ['default'],
  
  // Configuration des transformations
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Configuration des extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Configuration des alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^react-router-dom$': '<rootDir>/src/__mocks__/react-router-dom.ts',
  },
  
  // Configuration des mocks automatiques
  automock: false,
  
  // Configuration des mocks manuels
  moduleDirectories: ['node_modules', 'src'],
  
  // Configuration des tests en parallèle
  maxWorkers: '50%',
  
  // Configuration des snapshots
  snapshotSerializers: ['@testing-library/jest-dom'],
  
  // Configuration des variables d'environnement
  testEnvironmentOptions: {
    url: 'http://localhost:3001'
  },
  
  // Configuration des globals
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
