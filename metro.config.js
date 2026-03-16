const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Block test files from being bundled in the app.
config.resolver.blockList = [/\.test\.tsx?$/];

module.exports = config;
