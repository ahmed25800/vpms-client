import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,
    https: {
      pfx: fs.readFileSync(path.resolve(__dirname, './certs/certificate.pfx')),
      passphrase: 'Hossam@2025', // Replace with your .pfx file password
    },
  },
});