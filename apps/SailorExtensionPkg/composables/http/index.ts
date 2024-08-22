import { isEmpty, isFunction } from 'lodash-es';
import { access, EnumReadAs, EnumSendAs, queryString } from '@sailor-extension/utils'
import { sendMessage } from '../sendMessage'
import { getCookieByName } from '../cookies'
import { EnumWebToken, EnumAction } from '../const'
import { autoRefreshToken } from '../token'

export enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Delete = 'DELETE',
    Put = 'PUT',
    Head = 'HEAD',
}

interface HttpData extends RequestInit {
    url: string;
    method: HttpMethod;
    params?: Record<string, any>;
    body?: any;
    sendAs?: EnumSendAs;
    readAs?: EnumReadAs;
}

interface DoRequestParams {
    /**
     * http请求函数
     */
    request: () => Promise<any>;

    /**
     * 是否需要错误处理
     */
    errHandling: boolean;

    /**
     * 请求地址
     */
    url: string;

    /**
     * 是否需要返回响应头
     */
    resHeader: boolean;
}

/**
 * OpenAPI 配置对象
 */
type ConfigInfo = {
    protocol: string;

    ip: string;

    /**
     * 端口号
     */
    port: string | number;

    /**
     * 访问前缀
     */
    prefix: string;

    /**
     * 当前语言
     */
    lang?: string;

    /**
     * 网络异常时执行
     */
    onNetworkError?: () => void;

    /**
     * AS服务器无法连接时执行
     */
    onAsServerError?: () => void;

    /**
     * token无效或过期
     */
    onTokenError?: () => void;

    /**
     * 请求超时
     */
    onTimeout?: () => void;

}

/**
 * OpenAPI配置
 */
const Config: ConfigInfo = {
    protocol: 'https',
    ip: '',
    port: location.port,
    prefix: '',
    lang: 'zh-CN',
}

export const getConfig = (name?: keyof ConfigInfo) => name ? Config[name] : Config;

/**
 * 设置参数
 */
export const setup: (config: ConfigInfo) => void = (...config) => {
    access(Config, ...config)
}

export const getBaseUrl = () => {
    return `${Config.protocol}://${Config.ip}:${Config.port}${Config.prefix === '/' ? '' : Config.prefix}`
}

/**
 * 连接URL和参数
 */
export function joinURL(url: string, query?: Record<string, any> | string) {
    if (isEmpty(query)) {
        return url;
    }

    const [base, qs = ''] = url.split('?')
    const args = typeof query === 'object' ? queryString(query) : query
    const fullQuery = qs ? [qs, args].join('&') : args

    return fullQuery ? [base, fullQuery].join('?') : base
}

/**
 * 发起请求
 */
export const doRequest = ({ request }: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, body } = await request()

            if (status >= 400) {
                // token无效或过期
                if (status === 401) {
                    try {
                        const res = await autoRefreshToken(() => doRequest({ request }))
                        resolve(res)
                    } catch {
                        isFunction(Config.onTokenError) && Config.onTokenError()
                        return reject(body)
                    }
                } else if (status === 502 || status === 503) {
                    isFunction(Config.onAsServerError) && Config.onAsServerError()
                    return reject(body)
                } else {
                    return reject(body)
                }
            } else {
                return resolve(body)
            }
        } catch (ex: any) {
            if (!navigator.onLine) {
                isFunction(Config.onNetworkError) && Config.onNetworkError();
            } else if (ex?.status === -1) {
                // 无法连接服务器，服务器没有响应
                isFunction(Config.onAsServerError) && Config.onAsServerError();
            } else if (ex.isTimeout) {
                // 请求超时
                isFunction(Config.onTimeout) && Config.onTimeout();
            }
            return reject(ex)
        }
    })
}

export const http = async ({ url, method, headers, params, body, ...other }: HttpData): Promise<any> => {
    const baseUrl = `${Config.protocol}://${Config.ip}:${Config.port}${Config.prefix === '/' ? '' : Config.prefix}`
    const resUrl = /^(http|https):\/\/.*$/.test(url) ? url : `${baseUrl}${url}`
    const _url = joinURL(resUrl, params)

    const request = async () => {
        const _headers: Record<string, any> = {
            ...headers,
            'cache-control': 'no-cache',
            'x-language': (Config?.lang || 'zh-CN')?.replace(/-.*$/, (s) => s.toUpperCase()),
            authorization: `Bearer ${await getCookieByName(EnumWebToken.Oauth2Token, Config.ip)}`,
        }

        return sendMessage({
            action: EnumAction.Fetch,
            data: {
                url: _url,
                method,
                body,
                headers: _headers,
                ...other,
            },
        })
    }

    return new Promise(async (resolve, reject) => {
        return doRequest({ request }).then(resolve).catch(reject)
    })
}