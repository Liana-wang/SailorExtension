export interface OpenWithResp {
    name: string;
    /**
     * 默认打开模式（0表示只读，1表示编辑，-1表示未配置）
     */
    mode: number;
}