import { browser } from 'wxt/browser'
import { request } from '@sailor-extension/utils'
import { EnumAction } from '@/composables/const'

export default defineBackground(() => {
    // 监听点击浏览器扩展popup图标事件
    (browser.action ?? browser.browserAction).onClicked?.addListener?.((tab) => {
        browser.tabs.sendMessage(tab.id as number, { action: EnumAction.PopupClick })
    })

    browser?.runtime?.onMessage?.addListener?.((message, sender, sendResponse) => {
        if (message && message.action) {
            switch (message.action) {
                case EnumAction.GetCookies: {
                    return browser.cookies.getAll(message?.data)
                }

                case EnumAction.Fetch: {
                    if (!message.data) {
                        return Promise.reject('请求格式错误：data is null')
                    }

                    return request(message?.data)
                }
            }
        }
    })
})
