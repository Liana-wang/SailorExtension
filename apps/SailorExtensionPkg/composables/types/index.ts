import { EnumDomainInfo } from '../const'
import type { NavInfo, UserInfo } from '../apis'

export interface ActiveNav {
    nav: NavInfo;
    text?: string;
}

export interface SandboxConfig {
    navs?: NavInfo[];
    activeNav?: ActiveNav;
    userInfo?: UserInfo;
    domainInfo?: Record<EnumDomainInfo, string>;
    oemConfig?: Record<string, any>;
    lang?: string;
    oauthToken?: string;
    selectedText?: string;
    [key: string]: any;
}