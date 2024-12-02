module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // For TypeScript files
      '^.+\\.(js|jsx)$': 'babel-jest', // For JavaScript files
    },
    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy', // Handle CSS imports in tests
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)', // Un-ignore axios for transformation
    ],
  };
  