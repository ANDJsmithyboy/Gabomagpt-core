import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		sveltekit(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/onnxruntime-web/dist/*.jsep.*',

					dest: 'wasm'
				}
			]
		})
	],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
		APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build')
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				ws: true
			},
			'/ws': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				ws: true
			},
			'/health': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/internal': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/oauth': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/ollama': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/openai': {
				target: 'http://localhost:8080',
				changeOrigin: true
			},
			'/audio/api': {
				target: 'http://localhost:8080',
				changeOrigin: true
			}
		}
	},
	build: {
		sourcemap: false,
		chunkSizeWarningLimit: 1500
	},
	worker: {
		format: 'es'
	},
	esbuild: {
		pure: process.env.ENV === 'dev' ? [] : ['console.log', 'console.debug', 'console.error']
	}
});
