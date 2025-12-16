# Codemagic Android Build Setup

The project is configured to build signed Android APKs automatically.

## Keystore Information

A keystore file is included at `android/app/vibeplay-release.keystore`.

## Setting Up Codemagic Environment Variables

Before building, you need to add the keystore credentials as environment variables in Codemagic:

1. Go to your app in Codemagic
2. Click on **Environment variables** tab
3. Add the following variables under a group named `keystore_credentials`:

| Variable Name | Value |
|--------------|-------|
| `CM_KEYSTORE_PASSWORD` | `vibeplay123` |
| `CM_KEY_ALIAS` | `vibeplay` |
| `CM_KEY_PASSWORD` | `vibeplay123` |

4. Mark all three as **Secure** (encrypted)
5. Save the changes

## Building

1. Push your code to GitHub
2. In Codemagic, click "Start new build"
3. Select the `android-workflow` workflow
4. The build will automatically:
   - Install npm dependencies
   - Build the web app
   - Sync with Capacitor
   - Build a signed release APK

## Security Note

For production apps:
- Generate a new keystore with a strong, unique password
- Never commit the keystore passwords to version control
- Use Codemagic's encrypted environment variables

## Local Development

For local release builds, you can create `android/keystore.properties`:

```properties
storeFile=app/vibeplay-release.keystore
storePassword=vibeplay123
keyAlias=vibeplay
keyPassword=vibeplay123
```

Then run:
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```
