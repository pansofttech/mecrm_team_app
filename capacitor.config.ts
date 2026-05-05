import type { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.pansofttech.mecrm',
  appName: 'MECRM',
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
      appId: '7d9faee0-6da0-4227-96e4-82d1b3a204af',
      defaultChannel: environment.capChannel
    }
  },
};

export default config;
