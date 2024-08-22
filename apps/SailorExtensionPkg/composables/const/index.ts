/**
 * AS存在Web的cookie
 */
export const enum EnumWebToken {
    Lang = 'lang',
    IdToken = 'id_token',
    Oauth2Token = 'client.oauth2_token',
    RefreshToken = 'client.oauth2_refresh_token',
}

/**
 * 文档域信息
 */
export const enum EnumDomainInfo {
    Protocol = 'protocol',
    Ip = 'ip',
    Port = 'port',
    Prefix = 'prefix',
}

export const enum EnumOpenWinMsgId {
    OauthStart = 'oauth_start',
    OauthLogin = 'oauth_login',
    OauthSuccess = 'oauth_success',
}

/**
 * postMessage id
 */
export const enum EnumSanboxMsgId {
    SandboxLoaded = 'sandbox_loaded',
    SandboxInit = 'sandbox_init',
    UpdateConfig = 'update_config',
    GetToken = 'get_Token',
    RefreshToken = 'refresh_token',
    NetworkError = 'network_error',
    AsServerError = 'as_server_error',
    TokenError = 'token_error',
    OpenLocation = 'open_location',
    Fetch = 'fetch',
    ActiveNav = 'active_nav',
}

/**
 * background、content、sandbox、popup的message id
 */
export const enum EnumAction {
    Fetch = 'fetch',
    GetCookies = 'getCookies',
    PopupClick = 'popupClick',
}

/**
 * 存储在storage里的key
 */
export const enum EnumStorageKey {
    DomainIfon = 'domainInfo',
    OemConfig = 'oemConfig',
    UserInfo = 'userInfo',
    Lang ='lang',
}