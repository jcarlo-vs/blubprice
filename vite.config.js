import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://pro-api.coinmarketcap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const apiKey = process.env.VITE_CMC_PRO_API_KEY;
            if (apiKey) {
              proxyReq.setHeader("X-CMC_PRO_API_KEY", apiKey);
            } else {
              console.error("API key is not defined");
            }
          });
        },
      },
    },
  },
});
