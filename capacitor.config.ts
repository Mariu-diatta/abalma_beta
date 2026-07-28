import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.app',
    appName: 'Abalma',
    webDir: 'build',

    plugins: {
        GoogleAuth: {
            scopes: [
                'profile',
                'email'
            ],
            serverClientId:
                '154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com',
            forceCodeForRefreshToken: true
        }
    }
};

export default config;