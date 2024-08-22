import { EnumOpenWinMsgId } from '@/composables/const'

export default defineUnlistedScript(() => {
    if (window.opener) {
        window?.opener?.postMessage({ id: EnumOpenWinMsgId.OauthStart }, '*')

        // oauth窗口移除扩展
        window.addEventListener('message', (event) => {
            if (event?.data?.id === EnumOpenWinMsgId.OauthLogin) {
                const container = document.getElementsByTagName('as-sailor')
                document.body.removeChild(container[0])
            }
        }, false)

        // 监听oauth成功
        if (window.location.href.indexOf('/homepage') !== -1) {
            window?.opener?.postMessage({ id: EnumOpenWinMsgId.OauthSuccess }, '*')
        }
    }
})
