import { includes, findKey } from 'lodash-es'
import {
    FileArchiveColored,
    FileAudioColored,
    FileCadColored,
    FileExcelColored,
    FileExeColored,
    FileHtmlColored,
    FileImageColored,
    FilePdfColored,
    FilePhotoshopColored,
    FilePptColored,
    FileTextColored,
    FileUnknownColored,
    FileVideoColored,
    FileWordColored,
    FileDrawioColored,
    FolderColored,
    FolderUserColored,
    FolderCustomColored,
    FolderKcColored,
    FolderGroupColored,
} from '@sailor-extension/icons'
import { replaceGns } from '@sailor-extension/utils'
import { DocLibType, DocType } from '../doclib'
import { getOpenLocationUrl } from '../location'
import { AppListConfig, OpenMethodConfig, OpenMethodNameEnum } from '../cache'

/**
 * 文档库图标
 */
const docLibIcons = {
    [DocLibType.UserDocLib]: FolderUserColored,
    [DocLibType.DepDocLib]: FolderGroupColored,
    [DocLibType.CustomDocLib]: FolderCustomColored,
    [DocLibType.KnowledgeDocLib]: FolderKcColored,
    [DocLibType.SharedUserDocLib]: FolderUserColored,
}

export const enum FileType {
    WORD = 'WORD',
    EXCEL = 'EXCEL',
    PPT = 'PPT',
    PDF = 'PDF',
    TXT = 'TXT',
    IMG = 'IMG',
    ARCHIVE = 'ARCHIVE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    EXE = 'EXE',
    CAD = 'CAD',
    PSD = 'PSD',
    VISIO = 'VISIO',
    HTML = 'HTML',
    SEP = 'SEP',
    DRAWIO = 'DRAWIO',
    WIKIDOC = 'WIKIDOC',
    BASE = 'BASE',
}

const icons: {[K in FileType]: any} = {
    [FileType.WORD]: FileWordColored,
    [FileType.EXCEL]: FileExcelColored,
    [FileType.PPT]: FilePptColored,
    [FileType.PDF]: FilePdfColored,
    [FileType.TXT]: FileTextColored,
    [FileType.IMG]: FileImageColored,
    [FileType.ARCHIVE]: FileArchiveColored,
    [FileType.VIDEO]: FileVideoColored,
    [FileType.AUDIO]: FileAudioColored,
    [FileType.EXE]: FileExeColored,
    [FileType.CAD]: FileCadColored,
    [FileType.PSD]: FilePhotoshopColored,
    [FileType.HTML]: FileHtmlColored,
    [FileType.SEP]: FileUnknownColored,
    [FileType.DRAWIO]: FileDrawioColored,
    [FileType.WIKIDOC]: FileUnknownColored,
    [FileType.BASE]: FileUnknownColored,
    [FileType.VISIO]: FileUnknownColored,
}

/**
 * @static
 */
const EXTENSIONS = {
    [FileType.WORD]: ['.docx', '.dotx', '.dot', '.doc', '.odt', '.wps', '.docm', '.dotm'],
    [FileType.EXCEL]: ['.xlsx', '.xlsm', '.xlsb', '.xls', '.et', '.xla', '.xltm', '.xltx', '.xlt', '.ods', '.csv', '.dbf', '.eis', '.tsv'],
    [FileType.PPT]: ['.pptx', '.ppt', '.pot', '.pps', '.ppsx', '.dps', '.potm', '.ppsm', '.potx', '.pptm', '.odp'],
    [FileType.PDF]: ['.pdf'],
    [FileType.TXT]: ['.txt'],
    [FileType.IMG]: ['.jpg', '.jpeg', '.gif', '.bmp', '.png', '.wmf', '.emf', '.svg', '.tga', '.tif'],
    [FileType.ARCHIVE]: ['.zip', '.rar', '.tgz', '.tar', '.cab', '.uue', '.jar', '.ace', '.lzh', '.arj', '.gzip', '.gz', '.gz2', '.bz', '.bz2', '.7z', '.iso', '.rpm'],
    [FileType.VIDEO]: ['.avi', '.rmvb', '.rm', '.mp4', '.3gp', '.mkv', '.mov', '.mpg', '.mpeg', '.wmv', '.flv', '.asf', '.h264', '.x264', '.mts', '.m2ts', '.m4v'],
    [FileType.AUDIO]: ['.mp3', '.aac', '.wav', '.wma', '.flac', '.m4a', '.ape', '.ogg'],
    [FileType.EXE]: ['.exe', '.msi', '.bat'],
    [FileType.CAD]: ['.dwg', '.dwt', '.dxf'],
    [FileType.PSD]: ['.psd'],
    [FileType.HTML]: ['.html'],
    [FileType.SEP]: ['.gd', '.sep'],
    [FileType.DRAWIO]: ['.drawio'],
    [FileType.WIKIDOC]: ['.wikidoc'],
    [FileType.BASE]: ['.base'],
}

/* 打开方式 */
export enum PreviewMethod {
    FOXITREADER = 'foxitreader',
    OPTIMIZE_PICTUER = 'optimize_picture',
    OPTIMIZE_AUDIO = 'optimize_audio',
    OPTIMIZE_VEDIO = 'optimize_vedio',
    NORMAL_PREVIEW = 'normal_preview',
    OFFICE_ONLINE = 'office_online',
    CAD_PREVIEW = 'cad_preview',
    WPS_PREVIEW = 'wps_preview',
    DRAWIO = 'drawio_preview',
}

/**
 * 生成RegExp对象
 * @param data
 * @returns
 */
function extensionToRegExp(data: string[]) {
    const str = data.map((item) => item.replace('.', '')).join('|');
    return new RegExp(`\\.(${str})$`);
}

export const PreviewMethodRegExp = {
    [PreviewMethod.OPTIMIZE_VEDIO]: extensionToRegExp(EXTENSIONS[FileType.VIDEO]),
};

/*
 * 支持wps编辑打开方式的正则
 */
export const matchWpsReg = /\.(xls|xlt|et|xlsx|xltx|csv|xlsm|xltm|doc|dot|wps|wpt|docx|dotx|docm|dotm|ppt|pptx|pptm|ppsx|ppsm|pps|potx|potm|dpt|dps|pdf|txt)$/;

/*
/*
 * 支持officeOnline打开方式的正则
 */
export const matchOfficeOnlineReg = /\.(ods|xlsb|xlsm|xlsx|odp|ppsx|pptx|docx|docm|odt|doc|xls|ppt)$/;

/*
 * 支持foxitreader打开方式的正则
 */
export const matchFoxitreadereReg = /\.(docx|dotx|dot|doc|odt|wps|docm|dotm|xlsx|xlsm|xlsb|xls|et|xltm|xltx|xlt|ods|pptx|ppt|pot|pps|ppsx|dps|potm|ppsm|potx|pptm|odp|pdf|txt|csv|xml|ott|ofd)$/;

/*
 * 支持cad打开方式的正则
 */
export const matchCadReg = /\.(dwg|dwt|dxf|ocf)$/;

/*
 * 支持音频打开方式的正则
 */
export const matchAudioReg = /\.(mp3|aac|wav|wma|flac|m4a|ape|ogg)$/;

/*
 * 支持视频打开方式的正则
 */
export const matchVideoReg = PreviewMethodRegExp[PreviewMethod.OPTIMIZE_VEDIO];

/**
 * 支持drawio打开方式的正则
 */
export const matchDrawioReg = /\.(drawio)$/;

/*
 * 支持图片打开方式的正则
 */
export const matchPictureReg = /\.(jpg|jpeg|gif|bmp|png|tif|psd|psb|ai)$/;

/**
 * 序列化文件名
 * @param 文件名或扩展名
 */
function serializeName(name: string): string {
    if (!name) {
        return ''
    }

    const dotIndex = name.lastIndexOf('.')

    if (dotIndex === -1) {
        // 输入字段即为扩展名，则加上"."
        return '.' + name;
    } else {
        // 截取最后一个"."到结尾字符串
        return name.slice(dotIndex)
    }
}

/**
 * 获取文件名
 * @param fullname
 * @return [name, ext]
 */
export function splitName(name: string): [string, string] {
    if (!name) {
        return ['', '']
    }

    const dotIndex = name.lastIndexOf('.')
    if (dotIndex === -1) {
        return [name, ''];
    }

    return [name.slice(0, dotIndex), name.slice(dotIndex + 1)]
}

/**
 * 获取文档类型
 * @param extension 文件名或扩展名
 * @return 返回文档类型
 */
export function findType(name: string): string {
    return findKey(EXTENSIONS, (exts) => {
        return includes(exts, serializeName(name.toLowerCase()))
    }) || ''
}

/**
 * 获取文件图标
 */
export function getFileIcon({ name, size, doc_lib_type, doc_type }: { name: string; size?: number; doc_lib_type?: DocLibType; doc_type?: DocType; }): any {
    if (size === -1) {
        if (doc_type === DocType.DocLib && doc_lib_type) {
            return docLibIcons[doc_lib_type]
        }

        return FolderColored
    }

    return icons[findType(name) as (keyof typeof FileType)] || FileUnknownColored
}

/**
 * 获取文件打开方式
 */
export const getOpenMethods = ({
    docName,
    hasWps = false,
    hasOfficeOnline = false,
}: {
        docName: string;
        hasWps: boolean;
        hasOfficeOnline: boolean;
    }) => {
    let openMethods: string[] = [];
    const itemName = docName.toLocaleLowerCase()

    if (matchWpsReg.test(itemName) && hasWps) {
        openMethods= [...openMethods, PreviewMethod.WPS_PREVIEW]
    }
    if (matchOfficeOnlineReg.test(itemName) && hasOfficeOnline) {
        openMethods= [...openMethods, PreviewMethod.OFFICE_ONLINE]
    }
    if (matchFoxitreadereReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.FOXITREADER]
    }
    if (matchCadReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.CAD_PREVIEW]
    }
    if (matchAudioReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.OPTIMIZE_AUDIO]
    }
    if (matchVideoReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.OPTIMIZE_VEDIO]
    }
    if (matchPictureReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.OPTIMIZE_PICTUER]
    }
    if (matchDrawioReg.test(itemName)) {
        openMethods= [...openMethods, PreviewMethod.DRAWIO]
    }
    return openMethods;
}

/**
 * 获取预览链接
 */
export const getPreviewUrl = async ({ name, docid, size, doc_lib_type }: { name: string; docid: string; size?: number; doc_lib_type?: DocLibType }) => {
    const openMethods = await OpenMethodConfig.getInstance()

    const hasWps = openMethods.some(({ name }) => OpenMethodNameEnum.wps === name)
    const hasOfficeOnline = openMethods.some(({ name }) => OpenMethodNameEnum.office === name)

    const methods = getOpenMethods({
        docName: name,
        hasWps,
        hasOfficeOnline,
    })

    switch (true) {
        case methods.includes(PreviewMethod.WPS_PREVIEW):
            return `/anyshare/wpspreview/?_tb=none&gns=${replaceGns(docid)}&name=${name}`

        case methods.includes(PreviewMethod.OFFICE_ONLINE):
            return `/anyshare/officeonline/?_tb=none&gns=${replaceGns(docid)}&name=${name}`

        case methods.includes(PreviewMethod.FOXITREADER):
            return `/anyshare/foxitreader/?_tb=none&gns=${replaceGns(docid)}&name=${name}`

        case methods.includes(PreviewMethod.CAD_PREVIEW):
            return `/anyshare/cadpreview/?_tb=none&gns=${replaceGns(docid)}&name=${name}`

        case (methods.includes(PreviewMethod.OPTIMIZE_AUDIO) || methods.includes(PreviewMethod.OPTIMIZE_VEDIO)):
            return `/anyshare/play/?_tb=none&gns=${replaceGns(docid)}&name=${name}`

        case methods.includes(PreviewMethod.OPTIMIZE_PICTUER):
            return `/anyshare/previewimg/?_tb=none&docid=${docid}&name=${name}&size=${size}`

        case methods.includes(PreviewMethod.DRAWIO): {
            const flowChart = await AppListConfig.getAppInfoByCommand('drawio')

            if (flowChart) {
                return `/anyshare/microappsfullscreen/${flowChart?.functionid}/flowChart/?_tb=none&_docid=${docid}&_name=${name}&_type=${doc_lib_type}`
            }
            break
        }

        default:
            return await getOpenLocationUrl({ docid, name, size })
    }
}