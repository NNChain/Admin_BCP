// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/nn-ad/', 
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nn-ad/',
  server: {
    proxy: {
      '/api': {
        target: 'https://nnchainapi.espsofttech.org',
        changeOrigin: true,
        secure: false,
      },
      '/nftdata': {
        target: 'http://155.133.26.60',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nftdata/, ''),
      },
    },
  },
});

