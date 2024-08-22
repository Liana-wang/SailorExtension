import { http } from '@sailor-extension/utils'
import { IntelliSearch, EcoFileSearch } from './types'

export * from './types'

/**
 * 搜索
 */
export const intelliSearch: IntelliSearch = (data) => {
    return http.post({ url: '/api/intelli-search/v1/all-search', data })
}

export const ecoFileSearch: EcoFileSearch = (data) => {
    return http.post({ url: '/api/ecosearch/v1/file-search', data })
}