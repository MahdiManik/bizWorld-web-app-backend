// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

// Get the default Expo configuration
const config = getDefaultConfig(__dirname)

// Add additional node_modules paths to help with module resolution
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')]

// Enable symlinks (useful for some npm packages)
config.resolver.disableHierarchicalLookup = true

// Ensure we can resolve all necessary modules, especially Platform
config.resolver.extraNodeModules = {
  '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  react: path.resolve(__dirname, 'node_modules/react'),
  // Add resolution for modal-react-native-web
  'modal-react-native-web': path.resolve(
    __dirname,
    'node_modules/react-native-web'
  ),
  // Add explicit resolution for axios
  'axios': path.resolve(__dirname, 'node_modules/axios'),
  // Add web-specific alias for react-native-toast-notifications
  'react-native-toast-notifications': path.resolve(
    __dirname,
    'src/lib/toast-notifications-web.ts'
  ),
}

// Add source extensions to handle properly
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs']

// Web-specific configuration
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
)
config.resolver.sourceExts.push('svg')

// Properly handle module resolution for libraries
config.watchFolders = [path.resolve(__dirname, 'node_modules')]

// For NativeWind v4 - required for TailwindCSS styling
const { withNativeWind } = require('nativewind/metro')

// Export the configuration with NativeWind support
module.exports = withNativeWind(config, {
  input: './global.css',
})
