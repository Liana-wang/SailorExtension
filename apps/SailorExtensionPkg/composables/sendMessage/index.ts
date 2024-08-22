import { browser, Runtime } from 'wxt/browser'
import { EnumAction } from '../const'

interface IMessageType {
    action: EnumAction;
    data?: any;
}

export function sendMessage(message: IMessageType, options?: Runtime.SendMessageOptionsType) {
    return browser.runtime.sendMessage(message, options)
}