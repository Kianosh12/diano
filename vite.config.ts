import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      // The API key is injected directly into the build. 
      // This replaces 'process.env.API_KEY' in the code with the actual string literal during 'npm run build'.
      'process.env.API_KEY': JSON.stringify("AIzaSyDqxPxMBvJyXgpVsV0GeO47DQBx6Dhvc68"),
    },
  };
});