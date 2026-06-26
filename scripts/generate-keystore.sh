#!/bin/bash
# Generates a release keystore for Android signing (local development only).
# For production, use a properly secured keystore and store credentials in CI secrets.

set -e

KEYSTORE_PATH="android/app/release.keystore"
KEY_ALIAS="promptlabz"

if [ -f "$KEYSTORE_PATH" ]; then
  echo "Keystore already exists at $KEYSTORE_PATH"
  exit 0
fi

echo "Generating release keystore..."
keytool -genkey -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=PromptLabz, OU=Mobile, O=PromptLabz, L=Unknown, S=Unknown, C=BR" \
  -storepass android \
  -keypass android

echo ""
echo "Keystore generated at: $KEYSTORE_PATH"
echo ""
echo "To use in CI, encode it as base64:"
echo "  base64 -w 0 $KEYSTORE_PATH"
echo ""
echo "Add these GitHub Secrets:"
echo "  KEYSTORE_BASE64   = (output of base64 command above)"
echo "  KEYSTORE_PASSWORD = android"
echo "  KEY_ALIAS         = $KEY_ALIAS"
echo "  KEY_PASSWORD      = android"
