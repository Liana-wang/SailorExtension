import { OpenAPI } from '../types'

export interface NavInfo {
    id: string;
    name: string;
    display: string;
    description: string;
    icon: string;
    entry: string;
    [key: string]: any;
}

/**
 * 用户信息
 */
export type GettNavInfos = OpenAPI<void, NavInfo[]>

export type GetNavIcon = OpenAPI<string, string>