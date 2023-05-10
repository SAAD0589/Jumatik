import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marocapps.jumatik.sellandbuy',
  appName: 'Jumatik',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '157748997984-fbpdo0bkfvv8t0cs9so42s1ghp35k6qs.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    FacebookLogin: {
      appId: '3246208182295424',
      appName: 'Jumatik',
      loginMode: 'webview',
      cookieEnabled: false,
      reauthorizeEnabled: true,
      requestLegacyPublishPermissions: false,
      permissions: ['email', 'public_profile'],
    },
    CapacitorHttp: {
      enabled: true,
    },
    resources: {
      android: {
        // App icon path
        icon: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
        // Splash screen image path
        splash: 'android/app/src/main/res/drawable/splash.png',
      }
    
    },
  },
};

export default config;
