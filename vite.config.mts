import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
  plugins: [node({ entry: './src/extension.ts', formats: ['cjs'] })],
  build: {
    rollupOptions: {
      external: ['vscode'],
    },
  },
})
