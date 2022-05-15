import adapter from '@sveltejs/adapter-auto';
import polyfillNode from 'rollup-plugin-polyfill-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	plugins: [polyfillNode()],

	optimizeDeps: {
		exclude: ['dragula']
	},
	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		files: {
			assets: 'svelte/static',
			hooks: 'svelte/src/hooks',
			lib: 'svelte/src/lib',
			routes: 'svelte/src/routes',
			params: 'svelte/src/params',
			routes: 'svelte/src/routes',
			serviceWorker: 'svelte/src/service-worker',
			template: 'svelte/src/app.html'
		},
		paths: {
			assets: '',
			base: ''
	    },
    vite: {
        server: {
            fs: {
                allow: ['..']
            }
        }
    }
	},
};

export default config;
