import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { browser } from 'wxt/browser'
import { ConfigProvider, App as AntdApp, Drawer, Spin, Tooltip, message } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { StyleProvider } from '@ant-design/cssinjs'
import { getCurrentLang, i18n } from '@sailor-extension/core'
import { setup, getStorage, getCookieByName, EnumDomainInfo, AppConfigContext, EnumAction, EnumStorageKey, EnumWebToken } from '@/composables'
import { getUserInfo, getbasicinfo, getOEMConfig, getAvatarUrl, getMenus } from '@/composables/apis'
import type { NavInfo, UserInfo } from '@/composables/apis'
import type { ActiveNav } from '@/composables/types'
import Login from '@/components/Login'
import UserAvatar from '@/components/UserAvatar'
import SideContent from '@/components/SideContent'
import ResizeHandle from '@/components/ResizeHandle'
import Setting from '@/components/Setting'
import EntryBtn from '@/components/EntryBtn'
import ShortCuts from '@/components/ShortCuts'
import __ from './locale'
import styles from './style.module.css'

interface AppProps {
    getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
    getRootContainer: () => HTMLElement | ShadowRoot;
}

function App({ getPopupContainer, getRootContainer }: AppProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [domainInfo, setDomainInfo] = useState<Record<EnumDomainInfo, string>>()
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [oemConfig, setOemConfig] = useState<Record<string, any>>()
    const [curlang, setCurLang] = useState('')
    const [navs, setNavs] = useState<NavInfo[]>([])
    const [activeNav, setActiveNav] = useState<ActiveNav | null>(null)
    const [drawerWidth, setDrawerWidth] = useState(510)
    const drawerContainer = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        ConfigProvider.config({
            holderRender: (children) => (
                <StyleProvider hashPriority={'high'} container={getRootContainer()}>
                    <ConfigProvider prefixCls={'as'} iconPrefixCls={'icon'}>
                        <AntdApp message={{ getContainer: () => drawerContainer.current || document.body }}>
                            {children}
                        </AntdApp>
                    </ConfigProvider>
                </StyleProvider>
            ),
        })
    }, [])

    // 点击浏览器扩展popup图标控制抽屉是否显示
    const popListen = () => {
        browser.runtime.onMessage.addListener((message, render, sendResponse) => {
            if (message && message.action === EnumAction.PopupClick) {
                setOpen(!open)
            }
        })
    }

    // 初始化
    const init = async () => {
        try {
            setIsLoading(true)
            const { domainInfo: domain = { ip: '10.4.11.22', port: '443', protocol: 'https', prefix: '/' }, lang } = await getStorage([EnumStorageKey.DomainIfon, EnumStorageKey.Lang])

            const curlang = lang ||
                (
                    (domain && domain[EnumDomainInfo.Ip]) ?
                        await getCookieByName(EnumWebToken.Lang, domain[EnumDomainInfo.Ip])
                        : ''
                ) ||
                getCurrentLang()?.value

            setCurLang(curlang)
            i18n.setup({ locale: curlang })

            setDomainInfo(domain)

            if (domain && domain[EnumDomainInfo.Ip]) {
                setup({
                    protocol: domain[EnumDomainInfo.Protocol],
                    ip: domain[EnumDomainInfo.Ip],
                    port: domain[EnumDomainInfo.Port],
                    prefix: domain[EnumDomainInfo.Prefix],
                    lang: curlang,
                    onNetworkError: () => {
                        message.open({
                            type: 'warning',
                            content: __('无法连接网络'),
                        })
                    },
                    onAsServerError: () => {
                        message.open({
                            type: 'warning',
                            content: __('无法连接文档域'),
                        })
                    },
                    onTokenError: () => {
                        setUserInfo(null)
                        setIsLoading(false)
                    },
                })

                // const oemConfig = await getOEMConfig()
                // const userInfo = await getUserInfo()
                // const basicinfo = await getbasicinfo({ userid: userInfo.userid })
                // const avatarUrl = await getAvatarUrl()
                const menus = await getMenus()

                console.log({ menus })

                // setOemConfig(oemConfig)
                setNavs(menus)
                // setUserInfo({
                //     ...userInfo,
                //     avatar_url: avatarUrl.avatar_url || '',
                //     direct_deppaths: basicinfo?.directdepinfos,
                // })

                if (menus.length) {
                    setActiveNav({
                        nav: menus[0],
                        text: activeNav?.text || '',
                    })
                }
            }
        } catch (ex){ console.log({ ex })}

        setIsLoading(false)
    }

    useEffect(() => {
        if (open && !userInfo) {
            init()
        }

        popListen()
    }, [open])

    /**
     * 打开弹窗
     */
    const showDrawer = () => {
        setOpen(true)
    }

    /**
     * 关闭弹窗
     */
    const closeDrawer = () => {
        setOpen(false)
    }

    /**
     * 激活快捷入口
     */
    const activeShortCut = (arg: ActiveNav) => {
        setOpen(true)
        setActiveNav(arg)
    }

    /**
     * 退出登录
     */
    const logout = () => {
        setUserInfo(null)
        setActiveNav(null)
    }

    return (
        <StyleProvider container={getRootContainer()}>
            <ConfigProvider
                prefixCls={'as'}
                theme={{ token: { colorPrimary: oemConfig?.theme || '#126EE3' } }}
                getPopupContainer={getPopupContainer}
            >
                <AppConfigContext.Provider
                    value={{
                        domainInfo,
                        updateDomainInfo: setDomainInfo,
                        lang: curlang,
                    }}
                >
                    <ShortCuts
                        navs={navs}
                        onActive={activeShortCut}
                    />
                    <EntryBtn
                        onOpen={showDrawer}
                    />
                    <Drawer
                        open={open}
                        mask={false}
                        width={drawerWidth}
                        onClose={closeDrawer}
                        drawerRender={() => (
                            <ResizeHandle
                                width={drawerWidth}
                                onChangeWidth={setDrawerWidth}
                            >
                                <div className={styles['sidebar']} ref={drawerContainer}>
                                    <div className={styles['sidebar-body']}>
                                        {
                                            isLoading ? (
                                                <div className={styles['loading']}>
                                                    <Spin />
                                                </div>
                                            ) : (
                                                <SideContent
                                                    navs={navs}
                                                    activeNav={activeNav as ActiveNav}
                                                    domainInfo={domainInfo}
                                                    userInfo={userInfo as UserInfo}
                                                    oemConfig={oemConfig}
                                                    lang={curlang}
                                                />
                                            )
                                        }
                                        {/* {
                                            isLoading ? (
                                                <div className={styles['loading']}>
                                                    <Spin />
                                                </div>
                                            ) : !!userInfo ? (
                                                <SideContent
                                                    navs={navs}
                                                    activeNav={activeNav as ActiveNav}
                                                    domainInfo={domainInfo}
                                                    userInfo={userInfo}
                                                    oemConfig={oemConfig}
                                                    lang={curlang}
                                                />
                                            ) : (
                                                <Login
                                                    domainInfo={domainInfo}
                                                    loginSusccess={init}
                                                />
                                            )
                                        } */}
                                    </div>
                                    <div className={styles['nav-bar']}>
                                        <Tooltip placement={'bottom'} title={__('关闭')} color={'#737373d9'}>
                                            <CloseCircleOutlined className={styles['close']} onClick={closeDrawer} />
                                        </Tooltip>
                                        <div className={styles['avatar']}>
                                            <Setting
                                                getContainer={() => drawerContainer.current as HTMLElement}
                                                defaultLang={curlang}
                                                onChangeLang={init}
                                            />
                                            {
                                                !!userInfo && (
                                                    <UserAvatar
                                                        userInfo={userInfo}
                                                        onLogoutSusccess={logout}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </ResizeHandle>
                        )}
                    ></Drawer>
                </AppConfigContext.Provider>
            </ConfigProvider>
        </StyleProvider>
    )
}

export default App
