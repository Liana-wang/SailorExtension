import axios, { Canceler } from 'axios'
import { toPairs, isEmpty, map, filter, isArray, includes, curry } from 'lodash-es'
import { HTTPConfig } from './types'

const Config: HTTPConfig = {
    protocol: '',
    host: '',
    port: '',
    prefix: '',
    getToken: () => '',
}

export const setupOpenApi = (config: HTTPConfig): void => {
    for (const key in config) {
        Config[key] = config[key as keyof HTTPConfig]
    }
}

export const getBaseUrl = () => {
    return `${Config.protocol}://${Config.host}:${Config.port}${Config.prefix === '/' ? '' : Config.prefix}`
}

/**
 * 获取配置项
 * @param options 要获取的配置项，传递字符串返回单个配置
 */
export function getOpenAPIConfig(options: keyof HTTPConfig): any {
    return Config[options]
}

/**
 * 通过对象构建queryString
 * ```
 * queryString({id: 'aaa', keyword: ['w', 'b', 'c']})  // id=aaa&keyword=w&keyword=b&keyword=c
 * ```
 */
export function queryString(data: Record<string, string>): string {
    if (!data) {
        return '';
    }

    return map(
        filter(
            toPairs(data),
            ([, value]) => value !== undefined && value !== null,
        ),
        ([key, value]) => (
            isArray(value) && value.length > 0 ?
                value.map((item) => [key, encodeURIComponent(item)].join('=')).join('&')
                : [key, encodeURIComponent(value)].join('=')
        ),
    ).join('&')
}

const axiosInstance = axios.create()

// 是否正在刷新token的标记
let isRefreshing = false

let requests: ReadonlyArray<(config: any) => void> = []

// 错误响应拦截
axiosInstance.interceptors.response.use((res) => res, async (err) => {
    const refreshToken = Config?.refreshToken

    if (refreshToken && err.response && err.response.status === 401) {
        try {
            if (!isRefreshing) {
                isRefreshing = true

                const token = await refreshToken?.()

                if (token) {
                    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

                    setupOpenApi({
                        getToken: () => token,
                    })

                    requests.forEach((cb) => cb(token))
                    requests = []

                    return axiosInstance.request({
                        ...err.config,
                        headers: {
                            ...(err.config.headers || {}),
                            Authorization: `Bearer ${token}`,
                        },
                    })
                }

                throw err
            }

            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests = [
                    ...requests,
                    (token) => resolve(axiosInstance.request({
                        ...err.config,
                        headers: {
                            ...(err.config.headers || {}),
                            Authorization: `Bearer ${token}`,
                        },
                    })),
                ]
            })
        } catch (e) {
            isRefreshing = false

            throw err
        } finally {
            if (!requests.length) {
                isRefreshing = false
            }
        }
    } else {
        throw err
    }
})

const http = async (method: string, options: Record<string, any>) => {
    const { url = '', params = {}, data = {}, headers = {}, timeout = 60 * 1000, isResHeader = false } = options
    const CancelToken = axios.CancelToken;
    let cancel: Canceler
    const config = {
        timeout,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: 'Bearer ' + await getCurToken(),
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            'x-language': (Config?.lang || 'zh-CN')?.replace(/-.*$/, (s: string) => s.toUpperCase()),
            ...headers,
        },
        baseURL: `${Config.protocol}://${Config.host}:${Config.port}${Config.prefix === '/' ? '' : Config.prefix}`,
        validateStatus: (status: number) => status < 400,
        transformResponse: [(data: string) => {
            if (data) {
                try {
                    return JSON.parse(data)
                } catch {
                    return data
                }
            }
        }],
        timeoutErrorMessage: 'TIMEOUT',
        cancelToken: new CancelToken((c) => {
            // 这里的c就是取消当前请求的方法，这里把c赋值给cancel变量
            cancel = c;
        }),
    }

    // eslint-disable-next-line no-async-promise-executor
    const promise: any = new Promise(async (resolve, reject) => {
        try {
            let response
            let resHeaders
            const token = await getCurToken()

            if (!token) {
                throw ({ response: { status: 401 } })
            }

            config.headers.Authorization = 'Bearer ' + token

            switch (method) {
                case 'get':
                    {
                        isEmpty(params) ?
                            ({ data: response } = await axiosInstance[method](url, config)) :
                            ({ data: response } = await axiosInstance[method](url, {
                                ...config,
                                params: params,
                                paramsSerializer: { serialize: queryString },
                            }))
                    } break;

                case 'delete':
                case 'head':
                case 'options':
                    ({ data: response } = await axiosInstance[method](url, config))
                    break;

                case 'post':
                    ({ data: response, headers: resHeaders } = await axiosInstance[method](url, data, config))
                    break;
                case 'put':
                case 'patch':
                    ({ data: response } = await axiosInstance[method](url, data, config))
                    break;
            }

            resolve(method === 'post' && isResHeader ? { response, headers: resHeaders } : response)
        }
        catch (ex: any) {
            // ping 请求无需提示
            if (/\/v1\/ping/.test(url)) {
                reject(0)
                return
            }

            // 网络无法连接
            if (!navigator.onLine && Config.onNetworkError) {
                Config.onNetworkError()
                reject(0)
                return
            }

            // 超时
            if (ex.code === 'ECONNABORTED' && ex.toJSON && ex.toJSON().message === 'TIMEOUT' && Config.onTimeout) {
                Config.onTimeout()
                reject(0)
                return
            }

            // 取消请求（注，各个请求处理）
            if (ex.message === 'CANCEL') {
                reject('CANCEL')
                return
            }

            if (!ex.response && Config.onServerError) {
                Config.onServerError()
                reject(0)
                return
            }

            if (ex.response) {
                const { status, data } = ex.response

                // 401, token 过期
                if (includes([401], status) && Config.onTokenExpired) {
                    Config.onTokenExpired()
                    reject(status)
                    return
                }

                // 50x，服务器无法连接
                if (status >= 500 && Config.onServerError) {
                    Config.onServerError()
                    reject(status)
                    return
                }

                reject(data)
            }
        }
    })

    promise.abort = () => cancel('CANCEL')

    return promise
}

const getCurToken = async (): Promise<string> => {
    const token = await Config?.getToken?.()
    const { refreshToken } = Config

    if (token || !refreshToken) {
        return token
    }

    try {
        return await refreshToken()
    } catch (ex) {
        return ''
    }
}

export const get: (option: Record<string, any>) => Promise<any> = curry(http)('get')
export const post: (option: Record<string, any>) => Promise<any> = curry(http)('post')
export const del: (option: Record<string, any>) => Promise<any> = curry(http)('delete')
export const put: (option: Record<string, any>) => Promise<any> = curry(http)('put')