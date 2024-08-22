import { OpenAPI } from '../types'
import { DocLibType } from '../../doclib'

/**
 * 排序顺序
 */
export enum SortType {
    /**
     * 文档库名
     */
    DocLibName = 'doc_lib_name',

    /**
     * 修改时间
     */
    DateModified = 'date_modified',
}

/**
 * 排序结果方向
 */
export enum Direction {
    /**
     * 升序
     */
    Asc = 'asc',

    /**
     * 降序
     */
    Desc = 'desc',
}

/**
 * 文档库信息
 */
export interface DocLibInfo {
    /**
     * 创建时间
     */
    created_at: string;

    /**
     * 创建者
     */
    created_by: {
        id: string;
        name: string;
        type: string;
    };

    /**
     * id
     */
    id: string;

    /**
     * 文档库类型
     */
    type: DocLibType;

    /**
     * 修改者
     */
    modified_by: {
        id: string;
        name: string;
        type: string;
    };

    /**
     * 修改时间
     */
    modified_at: string;

    /**
     * 文档库名称
     */
    name: string;

    /**
     * 文档库变化标识
     */
    rev: string;
}

/**
 * 检查文档单个权限
 */
export type CheckPerm = OpenAPI<{
    /**
     * 文档id
     */
    docid: string;

    /**
     * "display" "read" "create" "modify" "delete"
     */
    perm: string;
}, {
    /**
         * 0表示OK 1表示未配置该权限 2表示拒绝该权限
         */
    result: number;
    }>;

/**
 * 获取入口文档库
 */
export type GetEntryDoclibs = OpenAPI<{
    /**
     * 文档库类型
     */
    type?: DocLibType;

    /**
     * 排序
     */
    sort?: SortType;

    /**
     * 排序结果方向
     */
    direction?: Direction;
}, ReadonlyArray<DocLibInfo>>;