import type { Matcher } from '@sailor-extension/utils'
import i18n from '../i18n/'

export default i18n([
    [
        '无法执行此操作',
        '無法執行此操作',
        'Action failed',
    ],
    [
        '您对文件“${name}”没有显示权限。',
        '您對檔案“${name}”沒有顯示權限。',
        'No Display permission over file "${name}".',
    ],
    [
        '您对文件夹“${name}”没有显示权限。',
        '您對資料夾“${name}”沒有顯示權限。',
        'No Display permission over folder "${name}".',
    ],
    [
        '您的账号已被冻结。',
        '您的帳戶已被凍結。',
        'Your account has been frozen.',
    ],
    [
        '文件 “${name}” 不存在，可能其所在路径发生变更。',
        '檔案 “${name}” 不存在，可能其所在路徑發生變更。',
        'File “${name}” does not exist or its path might have been changed.',
    ],
    [
        '文件夹 “${name}” 不存在，可能其所在路径发生变更。',
        '資料夾 “${name}” 不存在，可能其所在路徑發生變更。',
        'File "${name}" does not exist or its path might have been changed.',
    ],
]) as Matcher