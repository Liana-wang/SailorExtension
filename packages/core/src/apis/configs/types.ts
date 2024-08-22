import { OpenAPI } from '../types'

export type AppInfo = {
    buildinkey: string;
    command: string;
    contextmenuConfig: { [key: string]: any };
    entry: string;
    functionid: string;
    homepage: string;
    icon: string;
    locales: { [key: string]: string };
    platforms: ReadonlyArray<string>;
    provider: string;
    renderTo: ReadonlyArray<string>;
    renderType: string;
    route: string;
}

export interface OpenWithResp {
    name: string;
    /**
     * 默认打开模式（0表示只读，1表示编辑，-1表示未配置）
     */
    mode: number;
}

/**
 * 获取插件列表
 */
export type GetApplist = OpenAPI<void, { apps: ReadonlyArray<AppInfo> }>

/**
 * 获取打开方式
 */
export type GetOpenMethod = OpenAPI<void, OpenWithResp[]>