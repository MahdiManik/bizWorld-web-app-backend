# BizNest Mobile Development Guide

## Expo Package Compatibility

Dear Development Team,

Some packages may not be compatible with our current Expo version. Whenever you install a new package, please run these commands to check compatibility:

```bash
npx npx expo-doctor
```

```bash
npx expo install --check
```

This will help prevent version conflicts and ensure all dependencies work correctly with our Expo setup.

## EAS Setup and Build Commands

To set up and build your application using EAS (Expo Application Services), please follow these commands:

1. Check your EAS account:

```bash
eas whoami
```

2. If you haven't logged in yet:

```bash
eas login
```

3. Initialize EAS configuration:

```bash
eas init
```

4. Build for Android (preview profile):

```bash
eas build --platform android --profile preview
```

These commands will help you set up and manage your EAS builds effectively. Make sure to run them in sequence as shown above.
