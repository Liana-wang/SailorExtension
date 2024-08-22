/**
 * 语言类型
 */
export enum LangType {
    /**
     * 简体中文
     */
    CN = 'zh-cn',

    /**
     * 繁体中文
     */
    TW = 'zh-tw',

    /**
     * 英文
     */
    EN = 'en-us',
}

/**
 * 语言资源列表
 */
export const Languages = [{
    value: 'zh-cn',
    label: '简体中文',
},
{
    value: 'zh-tw',
    label: '繁體中文',
},
{
    value: 'en-us',
    label: 'English',
}]

/**
 * 获取当前的语言
 * @returns {Object} 返回当前语言
 */
export function getEnvLanguage(): string {
    return (window.navigator['language']).trim().toLowerCase()
}

/**
 * 获取当前的语言
 * @returns {Object} 返回当前语言
 */
export function getCurrentLang(): typeof Languages[0] {
    // 从浏览器版本、缓存等各个信息获取的语言
    const language = getEnvLanguage()
    let actualLang: LangType
    if (language === LangType.TW) {
        actualLang = LangType.TW
    } else if (/^en/.test(language)) {
        actualLang = LangType.EN
    } else if (language === LangType.CN || language === 'zh-hans-cn') {
        actualLang = LangType.CN
    } else {
        // 中/英/繁/华为较新系统浏览器语言为zh-hans-cn 以外的语言默认返回英文
        actualLang = LangType.EN
    }

    return Languages.find((item) => item?.value === actualLang) as typeof Languages[0]
}