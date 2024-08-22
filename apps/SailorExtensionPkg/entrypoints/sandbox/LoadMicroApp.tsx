import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { Spin } from 'antd'
import { loadMicroApp, initGlobalState, MicroApp } from 'qiankun'
import { EnumSanboxMsgId } from '@/composables/const'
import type { SandboxConfig } from '@/composables/types'
import { NavInfo } from '@/composables/apis'
import styles from './style.module.css'

interface LoadMicroAppProps {
    config?: SandboxConfig;
    appInfo: NavInfo | null;
}

const initialState = {
    selectedText: '',
}

const actions = initGlobalState(initialState)

let microApp: MicroApp | undefined

function LoadMicroApp({
    appInfo,
    config,
}: LoadMicroAppProps) {
    const container = useRef(null)

    useEffect(() => {
        if (container.current && appInfo) {
            load()
        }
        return () => {
            microApp && microApp.unmount()
            microApp = undefined
        }
    }, [])

    useEffect(() => {
        actions.setGlobalState({
            selectedText: config?.selectedText,
        })
    }, [config?.selectedText])

    /**
     * 获取token
     */
    const getToken = async () => {
        window?.parent?.postMessage({
            id: EnumSanboxMsgId.GetToken,
        }, '*')

        return new Promise((resolve: any) => {
            window.addEventListener('message', (event: MessageEvent<any>) => {
                if (event.data.id === EnumSanboxMsgId.GetToken) {
                    resolve(event.data.data?.token)
                }
            })
        })
    }

    /**
     * 刷新token
     */
    const refreshToken = async () => {
        window?.parent?.postMessage({
            id: EnumSanboxMsgId.RefreshToken,
        }, '*')

        return new Promise((resolve: any) => {
            window.addEventListener('message', (event: MessageEvent<any>) => {
                if (event.data.id === EnumSanboxMsgId.RefreshToken) {
                    resolve(event.data.data?.token)
                }
            })
        })
    }

    /**
     * 打开新页面
     */
    const openLocation = (url: string, options?: any) => {
        window?.parent?.postMessage({
            id: EnumSanboxMsgId.OpenLocation,
            data: {
                url,
                options,
            },
        }, '*')
    }

    /**
     * 发起fetch请求
     */
    const fetchFn = async (options: any) => {
        window?.parent?.postMessage({
            id: EnumSanboxMsgId.Fetch,
            data: options,
        }, '*')

        return new Promise((resolve: any) => {
            window.addEventListener('message', (event: MessageEvent<any>) => {
                if (event.data.id === EnumSanboxMsgId.Fetch) {
                    resolve(event.data.data)
                }
            })
        })
    }

    /**
     * 加载微应用
     */
    const load = async () => {
        if (container.current) {
            try {
                microApp = loadMicroApp(
                    {
                        name: appInfo?.name || '',
                        entry: appInfo?.entry || '',
                        container: container.current,
                        props: {
                            ...config,
                            getToken,
                            refreshToken,
                            openLocation,
                            fetchFn,
                        },
                    },
                    {},
                    {},
                )
            } catch { }
        }
    }

    return (
        <>
            <div
                ref={container}
                className={styles['micro-container']}
            >
                <div className={styles['loading']}>
                    <Spin />
                </div>
            </div>
        </>
    );
}

export default memo(LoadMicroApp)
