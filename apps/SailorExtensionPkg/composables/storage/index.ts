import { browser } from 'wxt/browser'

export const getStorage = (keys?: null | string | string[] | Record<string, any>): Promise<Record<string, any>> => {
    return browser.storage.sync.get(keys)
}

export const setStorage = (data: Record<string, any>): Promise<void> => {
    return browser.storage.sync.set(data)
}