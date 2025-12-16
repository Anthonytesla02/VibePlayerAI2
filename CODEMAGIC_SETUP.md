# Codemagic Android Build Setup

The project is now configured to build signed Android APKs automatically - no manual keystore upload needed!

## How It Works

The keystore file (`android/app/vibeplay-release.keystore`) is included in the repository, and the `codemagic.yaml` is configured to use it directly with environment variables.

## Keystore Credentials (for reference)

- **Keystore File:** `android/app/vibeplay-release.keystore`
- **Keystore Password:** `vibeplay123`
- **Key Alias:** `vibeplay`
- **Key Password:** `vibeplay123`

> **IMPORTANT:** For production apps, you should generate a new keystore with strong, unique passwords. Consider using Codemagic's encrypted environment variables for production credentials.

## Building on Codemagic

1. Push your code to GitHub
2. In Codemagic, click "Start new build"
3. Select the `android-workflow` workflow
4. The build will automatically sign the APK using the keystore in the repository

## Security Note

For enhanced security in production:
1. Go to **Team settings** > **Global variables & secrets**
2. Add these as encrypted variables:
   - `CM_KEYSTORE_PASSWORD`
   - `CM_KEY_PASSWORD`
3. Remove the plaintext passwords from `codemagic.yaml`

## Local Development

For local release builds:

```bash
cd android
./gradlew assembleRelease
```

The build.gradle is configured to use the keystore with the environment variables.
