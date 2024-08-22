import { toPairs, map, filter, isArray } from 'lodash-es'

export interface RequestOption extends RequestInit {
    url: string;
    readAs?: EnumReadAs;
    sendAs?: EnumSendAs;
}

export enum EnumSendAs {
    Json = 'json',
    Text = 'text',
    Form = 'form',
}

export enum EnumReadAs {
    Json = 'json',
    Text = 'text',
    Blob = 'blob',
    ArrayBuffer = 'arraybuffer',
}

/**
 * 通过对象构建queryString
 * ```
 * queryString({id: 'aaa', keyword: ['w', 'b', 'c']})  // id=aaa&keyword=w&keyword=b&keyword=c
 * ```
 */
export function queryString(data: Record<string, any>): string {
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

async function parseHttpResponse(response: Response, readAs = EnumReadAs.Json) {
    if (response == null) {
        return {
            status: -2,
            statusText: null,
            body: null,
        };
    } else if (response instanceof Error) {
        return {
            status: -1,
            statusText: `${response.name}: ${response.message}`,
            body: response.stack,
        }
    } else {
        switch (readAs) {
            case EnumReadAs.Json:
                return {
                    status: response.status,
                    statusText: response.statusText,
                    body: await response?.json(),
                }
            case EnumReadAs.Text:
                return {
                    status: response.status,
                    statusText: response.statusText,
                    body: await response?.text(),
                }
            case EnumReadAs.Blob:
                return {
                    status: response.status,
                    statusText: response.statusText,
                    body: await response?.blob(),
                }
            case EnumReadAs.ArrayBuffer:
                return {
                    status: response.status,
                    statusText: response.statusText,
                    body: await response?.arrayBuffer(),
                }

            default:
                return {
                    status: response.status,
                    statusText: response.statusText,
                    body: response,
                }
        }
    }
}

export const request = ({ sendAs = EnumSendAs.Json, readAs = EnumReadAs.Json, body, headers, ...others }: RequestOption) => {
    const requestOptions = {
        ...others,
    }

    let _body = body

    let _headers = {
        ...headers,
    }

    if (body) {
        switch (sendAs) {
            case EnumSendAs.Json:
                _body = JSON.stringify(body)
                _headers = {
                    'Content-type': 'application/json;charset=utf-8',
                    ..._headers,
                }
                break

            case EnumSendAs.Text:
                _body = String(body)
                _headers = {
                    'Content-type': 'text/plain;charset=utf-8',
                    ..._headers,
                }
                break

            case EnumSendAs.Form:
            default:
                _body = queryString(body as Record<string, any>)
                _headers = {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    ..._headers,
                }
                break
        }
    }

    // 监听状态
    const fetchOptions = {
        ...requestOptions,
        method: requestOptions?.method?.toUpperCase() || 'GET',
        headers: _headers,
        body: _body,
        credentials: 'include' as RequestCredentials,
    }

    return new Promise(async (resolve, reject) => {
        fetch(requestOptions?.url, fetchOptions as RequestInit).then((response) => {
            resolve(parseHttpResponse(response, readAs))
        }).catch((error) => {
            reject(parseHttpResponse(error, readAs))
        })
    })
}