import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	},
};

export default config;
/*
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';


/** @type {import('@sveltejs/kit').Config} *//*
const config = {/
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),

		files: {
			assets: 'svelte/static',
			hooks: 'svelte/src/hooks',
			lib: 'svelte/src/lib',
			routes: 'svelte/src/routes',
			params: 'svelte/src/params',
			serviceWorker: 'svelte/src/service-worker',
			template: 'svelte/src/app.html'
		},
		paths: {
			assets: '',
			base: ''
	    }/*,
		vite: {
			server: {
				fs: {
					allow: ['..']
				}
			},
			optimizeDeps: {
				esbuildOptions: {
					// Node.js global to browser globalThis
					define: {
						global: 'globalThis'
					},
					// Enable esbuild polyfill plugins
					plugins: [
						NodeGlobalsPolyfillPlugin({
							buffer: true,
							global: true,
							process: true,
							url: true,
							assert: true,
							crypto: true,
							http: true,
							https: true,
							os: true,
							stream: true
						})
					]
				}
			},
		}*//*
	},
};

export default config;
*/