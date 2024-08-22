import { getApplist } from '../apis/configs'
import type { AppInfo } from '../apis/configs/types'

type GetAppsConfigType = AppInfo[]

export const AppListConfig = (function () {
    let instance: GetAppsConfigType

    async function getConfig(): Promise<GetAppsConfigType> {
        try {
            const { apps } = await getApplist()

            return apps as GetAppsConfigType
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
        getAppInfoByCommand: async function (command: string) {
            if (!instance || instance.length === 0) {
                instance = await getConfig()
            }

            return instance.find((app) => app.command === command)
        },
    }
})()
