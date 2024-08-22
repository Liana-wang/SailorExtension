import { OpenAPI } from '../types'

export interface UserInfo {
    account: string;
    agreedtotermsofuse: boolean;
    csflevel: number;
    directdepinfos: ReadonlyArray<{
        depid: string;
        name: string;
    }>;
    freezestatus: boolean;
    ismanager: boolean;
    leakproofvalue: number;
    mail: string;
    name: string;
    needrealnameauth: boolean;
    needsecondauth: boolean;
    pwdcontrol: number;
    roleinfos: ReadonlyArray<any>;
    roletypes: ReadonlyArray<any>;
    telnumber: string;
    type: string;
    userid: string;
    usertype: number;
    direct_deppaths?: ReadonlyArray<{
        deppath: string;
    }>;
    [key: string]: any;
}

/**
 * 用户信息
 */
export type GetUserInfo = OpenAPI<void, UserInfo>

/**
 * 获取头像url
 */
export type GetAvatarUrl = OpenAPI<void, { avatar_url: string }>

export type Getbasicinfo = OpenAPI<{
    userid: string;
}, {
    directdepinfos: ReadonlyArray<{
        deppath: string;
    }>
}>