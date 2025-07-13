module.exports = {
  name: 'bizNest',
  slug: 'biznest-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.biznest.mobile',
    associatedDomains: ['applinks:bizworld.com'],
  },
  android: {
    package: 'com.biznest.mobile',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'bizworld.com',
            pathPrefix: '/login',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    eas: {
      projectId: '2245edfb-d42b-4188-8677-6064c0b020f3',
    },
  },
  owner: 'sergeihein',
  scheme: 'biznest',
  experiments: {
    newArchEnabled: true
  },
  plugins: ['expo-router'],
}
