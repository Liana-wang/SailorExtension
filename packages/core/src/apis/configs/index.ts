import { http } from '@sailor-extension/utils'
import {
    GetApplist,
    GetOpenMethod,
} from './types'

/**
 * 获取插件列表
 */
export const getApplist: GetApplist = (params?) => {
    return http.get({ url: '/api/appstore/v1/applist', params })
}

/**
 * 获取打开方式
 */
export const getOpenMethod: GetOpenMethod = () => {
    return http.get({ url: '/api/portal-management/v1/openwith' })
}