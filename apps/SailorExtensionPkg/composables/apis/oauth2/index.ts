import { EnumReadAs } from '@sailor-extension/utils'
import { http, HttpMethod } from '../../http'
import { getCookieByName } from '../../cookies'

/**
 * 刷新token
 */
export const refreshToken = () => {
    return http({
        method: HttpMethod.Get,
        url: '/anyshare/oauth2/login/refreshToken',
    })
}

export const logout = async () => {
    return http({
        method: HttpMethod.Get,
        url: '/anyshare/oauth2/logout',
        params: { redirect: await getCookieByName('client.origin_uri') },
        readAs: EnumReadAs.Text,
    })
}