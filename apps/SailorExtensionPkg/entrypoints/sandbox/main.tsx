import React from 'react';
import ReactDOM from 'react-dom/client'
import { EnumSanboxMsgId } from '@/composables/const'
import App from './App.tsx';
import './style.css'

window.parent.postMessage({
    id: EnumSanboxMsgId.SandboxLoaded,
}, '*')

ReactDOM.createRoot(document.getElementById('conent_root')!).render(
    <App />,
);
