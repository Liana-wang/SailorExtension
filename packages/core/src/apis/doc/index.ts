import { http } from '@sailor-extension/utils'
import { CheckPerm, GetEntryDoclibs } from './types'

/**
 * 检查文档单个权限
 */
export const checkPerm: CheckPerm = (params) => {
    return http.post({ url: '/api/eacp/v1/perm1/check', data: params })
}

/**
 * 获取入口文档库
 */
export const getEntryDoclibs: GetEntryDoclibs = (params?) => {
    return http.get({ url: '/api/efast/v1/entry-doc-lib', params })
}