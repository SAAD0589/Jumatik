import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marocapps.jumatik.sellandbuy',
  appName: 'Jumatik',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '764637492527-i6nkvftt30q205ea50c8uo83okegjjok.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
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
