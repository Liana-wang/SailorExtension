import { http, HttpMethod } from '../../http'
import type { GetUserInfo, Getbasicinfo } from './types'

export const getUserInfo: GetUserInfo = () => {
    return http({
        method: HttpMethod.Post,
        url: '/api/eacp/v1/user/get',
    })
}

export const getAvatarUrl = () => {
    return http({
        method: HttpMethod.Get,
        url: '/api/user-management/v1/profile/avatar_url?fields=avatar_url',
    })
}

/**
 * 获取用户部门基础信息
 */
export const getbasicinfo: Getbasicinfo = (body) => {
    return http({
        method: HttpMethod.Post,
        url: '/api/eacp/v1/user/getbasicinfo',
        body,
    })
}