import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style.css'

export default defineContentScript({
    matches: ['*://*/*'],
    cssInjectionMode: 'ui',

    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: 'as-sailor',
            position: 'overlay',
            anchor: 'body',
            append: 'last',
            zIndex: 2147483647,
            onMount: (container, shadowRoot) => {
                // 登录认证
                const script = document.createElement('script')
                script.setAttribute('type', 'text/javascript')
                script.src = browser.runtime.getURL('/inject.js')
                script.onload = function () { }
                document.head.appendChild(script)

                // Don't mount react app directly on <body>
                const wrapper = document.createElement('div')
                container.append(wrapper)

                const root = ReactDOM.createRoot(wrapper)
                root.render(
                    <App
                        getRootContainer={() => shadowRoot}
                        getPopupContainer={() => container}
                    />,
                )
                return { root, wrapper }
            },
            onRemove: (elements) => {
                elements?.root.unmount()
                elements?.wrapper.remove()
            },
        })

        ui.mount()
    },
})
