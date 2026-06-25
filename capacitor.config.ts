import type { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.pansofttech.mecrm',
  appName: 'ECRMPro',
  webDir: 'dist/ecrm-frontend',
  plugins: {
    StatusBar: {
      overlaysWebView: true,
    },
    CapacitorSQLite: {
      iosIsEncryption: true,
      androidIsEncryption: true,
    },
    Keyboard: {
      resize: "native",
      resizeOnFullScreen: true
    },
    LiveUpdate: {
      appId: 'd85cb05a-f16f-40d9-a5d0-527ce930d17a',
      defaultChannel: environment.capChannel
    },
    App: {
      urlScheme: "ecrmpro"
    }
  },
  platforms: {
    ios: {
      plugins: {
        StatusBar: {
          overlaysWebView: false,
        },
      },
    },
    android: {
      plugins: {
        StatusBar: {
          overlaysWebView: true,
        },
      },
    },
  },
};

export default config;
