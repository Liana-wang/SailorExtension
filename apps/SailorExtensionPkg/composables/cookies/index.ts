import { Cookies } from 'wxt/browser'
import { EnumAction, EnumDomainInfo } from '../const'
import { getConfig } from '../http'

// content script中使用
export const getAllCookies = (details: Cookies.GetAllDetailsType): Promise<Cookies.Cookie[]> => {
    return sendMessage({
        action: EnumAction.GetCookies,
        data: details,
    })
}

export const getCookieByName = async (name: string, domain?: string): Promise<string> => {
    try {
        let ip = domain
        if (!ip) {
            ip = getConfig(EnumDomainInfo.Ip) as string
        }
        const cookies = await getAllCookies({
            name,
            domain: ip,
        })

        return cookies[0]?.value
    } catch (e) {
        throw e
    }
}