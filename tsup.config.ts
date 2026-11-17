import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
    'effects/starfield': 'src/effects/starfield-depth.ts'
  },
  dts: true,
  format: ['esm'],
  target: 'esnext',
  clean: true
})
