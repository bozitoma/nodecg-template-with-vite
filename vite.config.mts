import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import nodecg from './vite-plugin-nodecg.mts';
import { nodecgSchemas } from './vite-plugin-nodecg-schemas.mts';
import rollupEsbuild from 'rollup-plugin-esbuild';
import rollupExternals from 'rollup-plugin-node-externals';
import { BUNDLE_NAME } from './bundleName';

export default defineConfig({
  plugins: [
    react(),
    nodecg({
      bundleName: BUNDLE_NAME,
      graphics: './src/browser/graphics/*/index.tsx',
      dashboard: './src/browser/dashboard/*/index.tsx',
      extension: {
        input: './src/extension/index.ts',
        plugins: [rollupEsbuild(), rollupExternals()],
      },
    }),
    nodecgSchemas(),
  ]
});
