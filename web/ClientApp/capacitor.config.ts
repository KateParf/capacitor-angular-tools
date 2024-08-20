import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'withweb',
  webDir: 'dist/',
  plugins: {
    "CapacitorUpdater": {
      "autoUpdate": false,
    }
  }
};

export default config;
