import { OpenAPI } from '../types'
import { DocLibType, DocType } from '../../doclib'

interface IntelliSearchParams {
    keyword: string;
    type: string;
    custom: {
        business: string;
        rows: number;
        start: number;
    }[];
}

export interface IntelliSearchWikiInfo {
    article_id: string;
    as_id: string;
    collect_count: number;
    comment_count: number;
    content_update: number;
    create_time: number;
    digest: string;
    follow_count: number;
    follow_top_time: number;
    has_changed: boolean;
    has_collected: boolean;
    has_followed: boolean;
    has_liked: boolean;
    insert_time: number;
    like_count: number;
    publish_user: {
        Position: string;
        as_id: string;
        display_name: string;
        email: string;
        has_followed: boolean;
        head_img: string;
        introduction: string;
        is_delete: number;
        is_expert: number;
        is_knowledge: number;
        phone_number: string;
    };
    publisher_id: string;
    recently_time: number;
    reply_count: number;
    score: number;
    share_count: number;
    space_id: string;
    space_path: string;
    space_path_text: string;
    status: number;
    tag_ids: any,
    tag_infos: any[];
    tags: any[];
    thumbnail: string;
    title: string;
    topic_count: number;
    update_time: number;
    user: {
        Position: string;
        as_id: string;
        display_name: string;
        email: string;
        has_followed: boolean;
        head_img: string;
        introduction: string;
        is_delete: number;
        is_expert: number;
        is_knowledge: number;
        phone_number: string;
    },
    view_count: number;
    correlation_score: number;
    content: string;
}

export interface IntelliSearchDocInfo {
    basename: string;
    created_at: number;
    created_by: string;
    doc_id: string;
    doc_lib_type: string;
    doc_type: string[];
    extension: string;
    highlight: {
        content: string[];
        basename: string[];
        tags: any;
    },
    modified_at: number;
    modified_by: string;
    only_display: boolean;
    parent_path: string;
    score: number;
    security_level: number;
    size: number;
    source: string;
    summary: string;
    tags: string[];
    similarDocs: IntelliSearchDocInfo[],
    correlation_score: number;
}

interface EcoSearchCondition {
    tags?: string[];
    extension?: string[];
    created_by?: string[];
    modified_by?: string[];
}

interface EcoSearchParams {
    keyword?: string;
    type: string;
    range?: string[];
    rows: number;
    start?: number;
    highlight?: boolean;
    aggregation_required?: boolean;
    condition?: EcoSearchCondition;
    custom?: any[];
    completion?: {
        type: string;
        keyword: string;
    };
    dimension?: string[];
}

export interface EcoSearchInfo {
    basename: string;
    content: any;
    created_at: number;
    created_by: string;
    doc_id: string;
    doc_lib_type: DocLibType;
    doc_type: DocType[];
    extension: string;
    highlight: {
        basename: string[];
        content?: string[];
    };
    modified_at: number;
    modified_by: string;
    only_display: boolean;
    parent_path: string;
    score: number;
    security_level: number;
    size: number;
    source: string;
    summary: string;
    tags: string[];
    title: string[];
};

export interface EcoSearchHistory {
    id: number;
    keyword: string;
    search_type: string;
    timestamp: number;
    user_id: string;
}

// ============================================================================================================================

/**
 * 智能搜索
 */
export type IntelliSearch = OpenAPI<IntelliSearchParams, {
    [key: string]: {
        data: IntelliSearchDocInfo[] | IntelliSearchWikiInfo[];
        hits?: number;
        next?: number;
        pages?: {
            page: number;
            size: number;
            total: number;
        };
    }
}>;

/**
 * 内容检索
 */
export type EcoFileSearch = OpenAPI<EcoSearchParams, {
    condition: EcoSearchCondition;
    files: EcoSearchInfo[];
    hits: number;
    next: number;
    similar_docs: string[][];
    [key: string]: any;
}>;