/**
 * 去除gns://
 * @param docid
 * @returns
 */

export function replaceGns(docid: string) {
    return docid === '' ? '' : docid.replace('gns://', '');
}