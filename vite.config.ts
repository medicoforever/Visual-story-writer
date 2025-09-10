
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: Replace 'visual-story-writer' with the name of your GitHub repository.
  base: '/visual-story-writer/', 
  plugins: [react()],
})
