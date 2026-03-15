const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  // Base Expo configuration
  ...expoConfig,

  // Applies Prettier rules and disables formatting rules that conflict with Prettier
  eslintPluginPrettierRecommended,

  // Global ignores must be in their own standalone object
  {
    ignores: ['dist/', '.expo/', 'node_modules/'],
  },
];
