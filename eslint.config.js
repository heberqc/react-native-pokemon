const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginReactNative = require('eslint-plugin-react-native');
const jestPlugin = require('eslint-plugin-jest');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'react-native': eslintPluginReactNative,
    },
    rules: {
      'react-native/no-unused-styles': 'error',
      'react/display-name': 'off',
    },
  },
  {
    // Apply Jest rules to test files
    files: ['**/*.test.ts', '**/*.test.tsx', '**/jest.setup.js'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
    },
  },
]);
