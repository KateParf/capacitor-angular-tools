import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smsit.capacitordemo',
  appName: 'capacitordemo',
  webDir: 'dist/',
  
  plugins: {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "directUpdate": true,
      "allowModifyUrl": true,
    }
  },
  
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  
  android: {
    allowMixedContent: true
  },
};

export default config;
