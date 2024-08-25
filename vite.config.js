import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

// // vite.config.js
// import { defineConfig } from 'vite';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://pro-api.coinmarketcap.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//         headers: {
//           'X-CMC_PRO_API_KEY': 'YOUR_API_KEY',
//         },
//       },
//     },
//   },
// });
