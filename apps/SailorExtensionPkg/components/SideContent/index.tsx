import { useRef, useEffect, useState } from 'react'
import { browser } from 'wxt/browser'
import { Result, Spin } from 'antd'
import { EnumSanboxMsgId, EnumWebToken } from '@/composables'
import type { SandboxConfig } from '@/composables/types'
import { refreshToken } from '@/composables/apis'
import { http } from '@/composables'
import NpAppIcon from '@/assets/noapp.svg?react'
import __ from './locale'
import styles from './style.module.css'

const sanboxUrl = browser.runtime.getURL('/sandbox.html')

const SideContent = ({
    navs = [],
    activeNav,
    ...others
}: SandboxConfig) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const listener = async (event: MessageEvent<any>) => {
            switch (event.data.id) {
                case EnumSanboxMsgId.SandboxLoaded: {
                    const token = await getCookieByName(EnumWebToken.Oauth2Token)
                    setIsLoaded(true)
                    iframeRef.current?.contentWindow?.postMessage({
                        id: EnumSanboxMsgId.SandboxInit,
                        data: {
                            ...others,
                            navs,
                            activeNav,
                            token,
                        },
                    }, '*')
                    break
                }

                case EnumSanboxMsgId.GetToken: {
                    const token = await getCookieByName(EnumWebToken.Oauth2Token)
                    iframeRef.current?.contentWindow?.postMessage({
                        id: EnumSanboxMsgId.GetToken,
                        data: {
                            token,
                        },
                    }, '*')
                    break
                }

                case EnumSanboxMsgId.RefreshToken: {
                    await refreshToken()
                    const token = await getCookieByName(EnumWebToken.Oauth2Token)
                    iframeRef.current?.contentWindow?.postMessage({
                        id: EnumSanboxMsgId.RefreshToken,
                        data: {
                            token,
                        },
                    }, '*')
                    break
                }

                case EnumSanboxMsgId.OpenLocation: {
                    if (event.data?.data?.url) {
                        window.open(event.data.data.url)
                    }
                    break
                }

                case EnumSanboxMsgId.Fetch: {
                    let res: any
                    try {
                        const reponse = await http(event.data.data)
                        res = {
                            status: 1,
                            data: reponse,
                        }
                    } catch (error) {
                        res = {
                            status: 0,
                            data: error,
                        }
                    }

                    iframeRef.current?.contentWindow?.postMessage({
                        id: EnumSanboxMsgId.Fetch,
                        data: res,
                    }, '*')
                    break
                }
            }
        }

        window.addEventListener('message', listener)

        return () => {
            window.removeEventListener('message', listener)
        }
    }, [])

    useEffect(() => {
        if (navs.length) {
            const iframe = iframeRef.current

            if (iframe) {
                iframe?.contentWindow?.postMessage({
                    id: EnumSanboxMsgId.UpdateConfig,
                    data: { navs },
                }, '*')
            }
        } else {
            setIsLoaded(true)
        }
    }, [navs])

    useEffect(() => {
        if (activeNav) {
            const iframe = iframeRef.current

            if (iframe) {
                iframe?.contentWindow?.postMessage({
                    id: EnumSanboxMsgId.ActiveNav,
                    data: { activeNav },
                }, '*')
            }
        }
    }, [activeNav])

    return (
        <>
            <div
                className={styles['sidebar-content']}
                style={isLoaded ? { zIndex: '0' } : { zIndex: '-1' }}
            >
                {
                    !navs.length ?
                        <Result
                            icon={<NpAppIcon style={{ fontSize: 240 }}/>}
                            title={__('暂无内容')}
                            subTitle={__('功能正在逐步开放中，敬请期待')}
                        />
                        :
                        <iframe
                            src={sanboxUrl}
                            ref={iframeRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                backgroundColor: 'transparent',
                            }}
                        />
                }
            </div>
            {
                !isLoaded && (
                    <div className={styles['loading']}>
                        <Spin />
                    </div>
                )
            }
        </>
    )
}

export default SideContent