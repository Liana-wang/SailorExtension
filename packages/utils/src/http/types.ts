/**
 * HTTPConfig
 */
export interface HTTPConfig {
    /**
     * 协议
     */
    protocol?: string;

    /**
     * 开放api域名
     */
    host?: string;

    /**
     * 开放api端口
     */
    port?: string | number;

    /**
     * token
     */
    getToken: () => string;

    /**
     * 刷新token
     */
    refreshToken?: () => Promise<any>;

    /**
     * thrift接口的token
     */
    CSRFToken?: string;

    /**
     * token 过期
     */
    onTokenExpired?: () => void;

    /**
     * 服务器无法连接
     */
    onServerError?: () => void;

    /**
     * 网络无法连接
     */
    onNetworkError?: () => void;

    /**
     * 超时
     */
    onTimeout?: () => void;

    /**
     * 其他
     */
    [key: string]: any;
}

/**
 * http参数
 */
export interface HttpOptions {
    /**
     * 请求路径
     */
    url: string;

    /**
     * Query Params
     */
    params?: Record<string, any>;

    /**
     * body
     */
    data?: Record<string, any>;

    /**
     * 请求头信息
     */
    headers?: Record<string, any>;

    /**
     * 是否需要返回response headers
     */
    isResHeader?: boolean;

    /**
     * 超时时间
     */
    timeout?: number;
}