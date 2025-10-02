import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Vite dev 서버가 브라우저 요청(localhost:5173/api/...)을 가로챔
        target: "http://cambridge-env.eba-hrwjwz2s.ap-northeast-2.elasticbeanstalk.com", // http://cambridge-env...으로 요청을 대신 보냄
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // rewrite 규칙에 따라 /api/user/signup → /user/signup 으로 변환
        // "/api/user/signup" → "http://cambridge-env.../user/signup"
      },
    },
  },
})
