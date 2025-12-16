# Codemagic Android Build Setup

This guide explains how to configure Codemagic.io to build signed Android APKs for VibePlay.

## Keystore Information

A keystore file has been created at `android/app/vibeplay-release.keystore` with the following credentials:

- **Keystore Password:** `vibeplay123`
- **Key Alias:** `vibeplay`
- **Key Password:** `vibeplay123`

> **IMPORTANT:** For production apps, you should generate a new keystore with a strong, unique password and keep it secure. Never share your production keystore passwords publicly.

## Setting Up Codemagic

### Step 1: Add the Keystore to Codemagic

1. Log in to [Codemagic.io](https://codemagic.io)
2. Go to your app's settings
3. Navigate to **Code signing identities** (or **Android code signing**)
4. Click **Add keystore**
5. Upload the `android/app/vibeplay-release.keystore` file from this project
6. Fill in the details:
   - **Reference name:** `vibeplay_keystore` (must match the name in codemagic.yaml)
   - **Keystore password:** `vibeplay123`
   - **Key alias:** `vibeplay`
   - **Key password:** `vibeplay123`
7. Save the keystore

### Step 2: Verify codemagic.yaml

The `codemagic.yaml` file is already configured to use `vibeplay_keystore` as the signing reference:

```yaml
environment:
  android_signing:
    - vibeplay_keystore
```

### Step 3: Start a Build

1. Push your code to your repository
2. In Codemagic, start a new build
3. The build will automatically:
   - Install npm dependencies
   - Build the web app
   - Sync with Capacitor
   - Build a signed release APK

## Local Development Signing (Optional)

For local release builds, create `android/keystore.properties`:

```properties
storeFile=app/vibeplay-release.keystore
storePassword=vibeplay123
keyAlias=vibeplay
keyPassword=vibeplay123
```

Then run:
```bash
cd android
./gradlew assembleRelease
```

## Troubleshooting

### "No suitable keystores found matching reference"

This error means the keystore reference in `codemagic.yaml` doesn't match any keystore uploaded to Codemagic. Make sure:

1. The keystore is uploaded to Codemagic
2. The reference name matches exactly (case-sensitive): `vibeplay_keystore`

### Build fails with signing errors

Verify that:
- The keystore password is correct
- The key alias matches (`vibeplay`)
- The key password is correct
