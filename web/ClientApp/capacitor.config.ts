import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smsit.capacitordemo',
  appName: 'capacitordemo',
  webDir: 'dist/',
  
  plugins: {
    "CapacitorUpdater": {
      "autoUpdate": false,
    }
  },
  
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  
  android: {
    allowMixedContent: true
  },
};

export default config;
