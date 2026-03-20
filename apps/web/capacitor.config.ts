/* GabomaGPT · capacitor.config.ts · SmartANDJ AI Technologies
   Configuration Capacitor — Network-First Wrapper
   Pointe vers l'URL de production GabomaGPT
   Fondateur: Daniel Jonathan ANDJ */

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.smartandj.gabomagpt',
  appName: 'GabomaGPT',
  webDir: 'build',

  // Network-First : l'app pointe vers le backend de production
  server: {
    // En dev, utiliser l'URL locale ; en prod, l'URL Coolify
    url: process.env.CAPACITOR_SERVER_URL || 'https://gabomagpt.smartandj.ai',
    cleartext: true, // Autoriser HTTP en dev (à retirer en prod si HTTPS only)
    androidScheme: 'https'
  },

  // Plugins natifs
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#050810',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#C9A227',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#050810',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    App: {
      // Deep links (futur)
      // url: 'gabomagpt://'
    }
  },

  // Android specific
  android: {
    backgroundColor: '#050810',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false // true en dev
  },

  // iOS specific
  ios: {
    backgroundColor: '#050810',
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile'
  }
};

export default config;
