import { EnumReadAs } from '@sailor-extension/utils'
import { http, HttpMethod, getBaseUrl } from '../../http'
import type { GettNavInfos, GetNavIcon, NavInfo } from './types'

export const getOEMConfig = () => {
    return http({
        method: HttpMethod.Get,
        url: '/api/deploy-web-service/v1/oemconfig',
        params: { section: 'anyshare' },
    })
}

export const getNavInfos: GettNavInfos = () => {
    return http({
        method: HttpMethod.Get,
        url: '/api/browser-knowledge-assist/v1/app',
    })
}

export const getNavIcon: GetNavIcon = (url: string) => {
    return http({
        method: HttpMethod.Get,
        url,
        readAs: EnumReadAs.Text,
        headers: { 'Content-Type': 'image/svg+xml' },
    })
}

export const getMenus = async () => {
    try {
        // const navs = await getNavInfos()
        const navs = [
            {
                display: '搜索',
                entry: 'https://localhost:3008/search.html',
                icon: 'https://localhost:3008/icon/search.svg',
                id: '2111',
                name: 'sailor-search',
                description: '',
            },
        ]

        const res = await Promise.all(navs.map(async (item) => {
            const _icon = /^(http|https):\/\/.*$/.test(item?.icon) ? item?.icon : getBaseUrl() + item?.icon
            const _entry = /^(http|https):\/\/.*$/.test(item?.entry) ? item?.entry : getBaseUrl() + item?.entry

            if (/^.*\.svg.*$/.test(item?.icon)) {
                try {
                    const icon = await getNavIcon(item.icon)

                    return {
                        ...item,
                        iconSvg: icon,
                        icon: _icon,
                        entry: _entry,
                    }
                } catch { }
            }

            return {
                ...item,
                entry: _entry,
                icon: _icon,
            }
        }))

        return res

    } catch {
        return []
    }
}