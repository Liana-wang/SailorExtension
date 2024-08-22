import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import zhTW from 'antd/locale/zh_TW'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { i18n, LangType } from '@sailor-extension/core'
import { AppConfigContext } from '@/core'
import { http } from '@sailor-extension/utils'

export const init = (getRoutes: (viewProps: any) => any) => {
    let app: any

    const bootstrap = async (app: any) => {
        // console.log('app bootstraped')
    }

    const mount = async (props: any) => {
        const {
            lang = LangType.CN,
            domainInfo: {
                ip,
                port,
                prefix,
                protocol,
            },
            getToken,
            refreshToken,
            oemConfig,
        } = props

        i18n.setup({ locale: lang })

        http?.setupOpenApi?.({
            protocol,
            host: ip,
            port: Number(port),
            prefix,
            getToken,
            refreshToken,
            lang,
        })

        if (lang === LangType.CN) {
            dayjs.locale('zh-cn')
        } else if (lang === LangType.TW) {
            dayjs.locale('zh-tw')
        } else {
            dayjs.locale('en')
        }

        const container = (props.container ? props.container.querySelector('#sailor-plugin') : document.getElementById('sailor-plugin')) as HTMLElement

        ConfigProvider.config({
            holderRender: (children) => (
                <StyleProvider hashPriority={'high'} container={container}>
                    <ConfigProvider prefixCls={'sailor-plugin'} iconPrefixCls={'sailor-plugin-icon'}>
                        <AntdApp message={{ getContainer: () => container || document.body }}>
                            {children}
                        </AntdApp>
                    </ConfigProvider>
                </StyleProvider>
            ),
        })

        app = ReactDOM.createRoot(container)

        app.render(
            <StyleProvider container={container}>
                <ConfigProvider
                    prefixCls={'sailor-plugin'}
                    iconPrefixCls={'sailor-plugin-icon'}
                    locale={lang === LangType.CN ? zhCN : lang === LangType.TW ? zhTW : enUS}
                    theme={{
                        token: { colorPrimary: oemConfig?.theme || '#126EE3' },
                    }}
                    getPopupContainer={() => container}
                >
                    <AppConfigContext.Provider
                        value={props}
                    >
                        {getRoutes(props)}
                    </AppConfigContext.Provider>
                </ConfigProvider>
            </StyleProvider>,
        )
    }

    if (!window.__POWERED_BY_QIANKUN__) {
        mount({})
    }

    const unmount = async (props: any) => {
        app?.unmount()
    }

    return {
        bootstrap,
        mount,
        unmount,
    }
}
