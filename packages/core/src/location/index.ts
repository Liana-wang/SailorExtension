import { DocLibType } from '../doclib'
import __ from './locale'

const Type = {
    [DocLibType.UserDocLib]: 'user',
    [DocLibType.DepDocLib]: 'department',
    [DocLibType.CustomDocLib]: 'custom',
    [DocLibType.SharedUserDocLib]: 'shared_user',
    [DocLibType.KnowledgeDocLib]: 'knowledge_doc_lib',
}

type OpenLocation = (target: { docid: string; name: string; size?: number, doc_lib_type?: DocLibType; }, options?: { [key: string]: any }) => Promise<string>

/**
 * 根据docid获取路径
 * @param { docid, name, size = -1 } 文件信息
 * @param callback 回调，当从插件跳转到另一个插件时传出目标插件的信息targetMicroInfo
 * @param isOpen 是否打开文件夹
 */
export const getOpenLocationUrl: OpenLocation = async ({ docid, size = -1, doc_lib_type }, options = { isOpen: true }) => {
    const docId = docid.slice(6)
    const itemId = docId.substring(0, docId.lastIndexOf('/'))
    const selId = docId.substring(docId.lastIndexOf('/') + 1)

    const url = size === -1 && options.isOpen ?
        `/anyshare/dir/${docId}`
        : `/anyshare/dir/${docId.length <= 32 ? Type[doc_lib_type as DocLibType] : itemId}?sel=${selId}`

    return url
}