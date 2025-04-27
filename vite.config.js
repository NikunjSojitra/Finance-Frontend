import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '127.0.0.1',           // Localhost IP
      'localhost',           // Localhost
      '*.ngrok-free.app',    // If you're using ngrok with a dynamic URL (replace with your actual ngrok URL pattern)
      '0.0.0.0'              // Allow all network interfaces (optional, useful for accessing from LAN)
    ]
  }
})
