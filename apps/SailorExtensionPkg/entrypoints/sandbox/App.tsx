import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { omit } from 'lodash-es'
import { ConfigProvider, Tabs } from 'antd'
import { NavInfo } from '@/composables/apis'
import { EnumSanboxMsgId } from '@/composables/const'
import type { SandboxConfig, ActiveNav } from '@/composables/types'
import Logo from '@/components/Logo'
import LoadMicroApp from './LoadMicroApp'
import MicroLogo from './MicroLogo'
import styles from './style.module.css'

const App = () => {
    const [config, setConfig] = useState<SandboxConfig>()
    const [activedNav, setActiveNav] = useState<ActiveNav | null>(null)

    useLayoutEffect(() => {
        const listener = (event: { data: { id: string, data: SandboxConfig } }) => {
            const { data: { id, data } = {} } = event
            switch (id) {
                case EnumSanboxMsgId.SandboxInit: {
                    if (data?.activeNav) {
                        setActiveNav(data?.activeNav as ActiveNav)
                    }
                    setConfig(data)
                    break
                }

                case EnumSanboxMsgId.UpdateConfig: {
                    setConfig((prev) => ({
                        ...prev,
                        ...data,
                    }) as SandboxConfig)
                    break
                }

                case EnumSanboxMsgId.ActiveNav: {
                    setActiveNav(data?.activeNav as ActiveNav)
                    break
                }
            }
        }

        window.addEventListener('message', listener, false)

        return () => {
            window.removeEventListener('message', listener, false)
        }
    }, [])

    return (
        <ConfigProvider
            prefixCls={'as'}
            theme={{ token: { colorPrimary: config?.oemConfig?.theme || '#126EE3' } }}
        >
            <div
                className={styles['content']}
            >
                <div className={styles['app-header']}>
                    <div className={styles['app-title']}>
                        <Logo style={{ fontSize: 26, marginRight: 10, verticalAlign: 'middle' }} />
                        {activedNav?.nav?.display}
                    </div>
                    <span className={styles['space']} />
                </div>
                <Tabs
                    defaultActiveKey={activedNav?.nav?.id || ''}
                    activeKey={activedNav?.nav?.id || ''}
                    tabPosition={'right'}
                    className={styles['tab']}
                    onChange={(key) => setActiveNav({ nav: config?.navs?.find((nav) => nav.id === key) as NavInfo, text: '' })}
                    items={config?.navs?.map((nav) => ({
                        label: (
                            <div className={styles['menu-item']}>
                                <MicroLogo nav={nav} />
                                {nav.display}
                            </div>
                        ),
                        style: { padding: 0 },
                        key: nav.id,
                        children: (
                            <LoadMicroApp
                                appInfo={nav}
                                config={{
                                    ...omit(config, ['navs', 'activeNav']),
                                    selectedText: activedNav?.nav?.id === nav?.id ? activedNav?.text : '',
                                }}
                            />
                        ),
                    }))}
                />
            </div>
        </ConfigProvider>
    )
}

export default App
