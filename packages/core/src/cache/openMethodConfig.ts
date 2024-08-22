import { getOpenMethod } from '../apis/configs'
import type { OpenWithResp } from '../apis/configs/types'

export enum OpenMethodNameEnum {
    wps = 'WPS Office',
    office = 'Office Online',
    foxit = 'Foxit PDF',
}

type GetMethodConfigType = OpenWithResp[]

export const OpenMethodConfig = (function () {
    let instance: GetMethodConfigType

    async function getConfig(): Promise<GetMethodConfigType> {
        try {
            const data = await getOpenMethod()

            return data as GetMethodConfigType
        } catch (error) {
            return []
        }
    }

    return {
        getInstance: async function () {
            if (!instance || instance.length === 0) {
                instance = await getConfig()
            }
            return instance
        },
    }
})()
