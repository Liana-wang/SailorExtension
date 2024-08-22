import { refreshToken as getRefreshToken } from '../apis'

// 避免主应用和插件应用同时调用refreshToken
let isRefreshToken = false

/**
 * 刷新token
 */
export const refreshToken = async () => {
    try {
        if (isRefreshToken) {
            return new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    if (!isRefreshToken) {
                        clearInterval(timer)
                        resolve(true)
                    }
                }, 100)
            })
        } else {
            isRefreshToken = true
            const res = await getRefreshToken()
            isRefreshToken = false
            return res
        }
    } catch (ex) {
        isRefreshToken = false
        throw ex
    }
}

// 是否正在刷新token的标记
let isRefreshing = false

let requests: ReadonlyArray<() => void> = []

/**
 * 请求自动刷新token
 */
export const autoRefreshToken = async (doRequest: () => Promise<any>) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!isRefreshing) {
                isRefreshing = true
                await refreshToken()
                isRefreshing = false
                const allRequests = [() => resolve(doRequest()), ...requests]

                allRequests.forEach((cb) => cb())
                requests = []
            } else {
                requests = [
                    ...requests,
                    () => resolve(doRequest()),
                ]
            }
        } catch (err) {
            isRefreshing = false
            requests = []
            reject(err)
        }
    })
}