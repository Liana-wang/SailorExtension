import { defineConfig } from 'wxt'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    vite: ({ mode }) => ({
        plugins: [
            svgr({ svgrOptions: { icon: true } }),
        ],
        build: {
            sourcemap: false,
        },
        resolve: {
            alias: mode === 'development' ? {
                '@sailor-extension/utils': path.resolve(__dirname, '../../packages/utils/src'),
                '@sailor-extension/core': path.resolve(__dirname, '../../packages/core/src'),
            } : undefined,
        },
    }),
    manifest: {
        name: 'Sailor',
        description: 'Sailor',
        action: {},
        permissions: ['activeTab', 'storage', 'tabs', 'cookies'],
        host_permissions: ['<all_urls>'],
        web_accessible_resources: [{
            matches: ['*://*/*'],
            resources: ['sandbox.html', 'inject.js'],
        }],
    },
    zip: {
        name: 'sailor-extension',
        artifactTemplate: '{{name}}-{{version}}.zip',
    },
})
