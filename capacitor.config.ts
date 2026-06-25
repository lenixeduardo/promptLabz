import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.promptlabz.app",
  appName: "PromptLabz",
  webDir: "dist",
  server: {
    // Remove this block before App Store submission.
    // It points the native app to your production URL for live reload in development.
    // For App Store builds, the app must be self-contained (remove url + cleartext).
    // url: "https://promptlabz.vercel.app",
    // cleartext: false,
  },
  ios: {
    // iOS-specific configuration
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#EAF7F0",
    // Scroll elasticity provides native-feel bouncing
    scrollEnabled: true,
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#EAF7F0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#1E4D2F",
    },
    Keyboard: {
      resize: "body",
      style: "light",
      resizeOnFullScreen: true,
    },
  },
}

export default config
