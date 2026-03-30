/* GabomaGPT · capacitor.config.ts · SmartANDJ AI Technologies
   Configuration Capacitor — Network-First Hybrid Mobile App
   VPS Production: 31.220.80.217
   Fondateur: Daniel Jonathan ANDJ */

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.smartandj.gabomagpt',
  appName: 'GabomaGPT',
  webDir: 'build',

  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'http://31.220.80.217:3000',
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'ionic',
    allowNavigation: ['31.220.80.217', '*.smartandj.ai', 'api.groq.com']
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2200,
      launchAutoHide: true,
      launchFadeOutDuration: 600,
      backgroundColor: '#050810',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#050810',
      overlaysWebView: true
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    Haptics: {},
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_gabomagpt',
      iconColor: '#C9A84C',
      sound: 'notification.wav'
    },
    App: {
      url: 'gabomagpt://app',
      androidDefaultNavigationBarColor: '#050810'
    }
  },

  android: {
    backgroundColor: '#050810',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    overrideUserAgent: 'GabomaGPT-Android/1.0',
    appendUserAgent: 'GabomaGPT-Mobile',
    initialFocus: false,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    }
  },

  ios: {
    backgroundColor: '#050810',
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    overrideUserAgent: 'GabomaGPT-iOS/1.0',
    appendUserAgent: 'GabomaGPT-Mobile',
    limitsNavigationsToAppBoundDomains: true
  }
};

export default config;
