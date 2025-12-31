import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // We define process.env as a whole object to ensure 'process.env.API_KEY' resolves correctly
    // even if the 'process' global does not exist in the browser.
    'process.env': JSON.stringify({
      API_KEY: "AIzaSyDqxPxMBvJyXgpVsV0GeO47DQBx6Dhvc68",
    }),
  },
});