import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Input, Button, List, Result, Tooltip, Skeleton, theme } from 'antd'
import { useStyleRegister } from '@ant-design/cssinjs'
import dayjs from 'dayjs'
import { OpenlocationOutlined, SendOutlined, CloseCircleOutlined } from '@sailor-extension/icons'
import { ecoFileSearch, getFileIcon, getOpenLocationUrl, getPreviewUrl } from '@sailor-extension/core'
import type { EcoSearchInfo } from '@sailor-extension/core'
import { formatSize, http } from '@sailor-extension/utils'
import NoDataIcon from '@/assets/nodata.svg'
import __ from './locale'
import styles from './style.module.css'

const { useToken } = theme

interface AppProps {
    appProps?: any;
}

interface DataItem {
    id: string;
    key: string;
    list: EcoSearchInfo[];
    loading: boolean;
    total?: number;
    next?: number;
    moreLoading: boolean;
}

const size = 10

const Search = ({
    appProps = {},
}: AppProps) => {
    const { theme, token, hashId } = useToken()
    const wrapSSR = useStyleRegister(
        { theme, token, hashId, path: [] },
        () => [
            {
                [`.input-box:hover, .input-focus`]: {
                    borderColor: `${token.colorPrimary} !important`,
                },
                ['.send-icon:hover']: {
                    color: `${token.colorPrimary} !important`,
                },
            },
        ],
    )

    const [value, setValue] = useState<string>('')
    const [data, setData] = useState<DataItem[]>([])
    const [focus, setFocus] = useState(false)

    /**
     * 获取数据
     */
    const getData = async (key: string, start: number = 0) => {
        try {
            return await ecoFileSearch({
                rows: size,
                start,
                type: 'doc',
                keyword: key,
            })
        } catch {
            return {
                files: [],
                hits: 0,
                next: 0,
            }
        }
    }

    /**
     * 搜索
     */
    const handleSearch = async (value: string) => {
        try {
            if (!!value) {
                setData((prev) => ([
                    ...prev,
                    {
                        id: value + prev.length,
                        key: value,
                        list: [],
                        loading: true,
                        moreLoading: false,
                    },
                ]))

                setValue('')

                const { files = [], hits, next } = await getData(value, 0)

                setData((prev) => ([
                    ...prev.slice(0, -1),
                    {
                        id: value + (prev.length - 1),
                        key: value,
                        list: files,
                        loading: false,
                        total: hits,
                        next,
                        moreLoading: false,
                    },
                ]))
            }
        } catch{}
    }

    useEffect(() => {
        if (appProps?.selectedText) {
            handleSearch(appProps?.selectedText)
        }

        appProps?.onGlobalStateChange?.((state: any) => {
            if (state?.selectedText) {
                handleSearch(state?.selectedText)
            }
        })
    }, [])

    /**
     * 搜索关键字
     */
    const handleChange = async (value: string) => {
        setValue(value)
    }

    /**
     * 清除历史
     */
    const handleClear = () => {
        setData([])
    }

    /**
     * 打开所在位置
     */
    const handleOpenLocation = async (file: EcoSearchInfo) => {
        const url = await getOpenLocationUrl(
            { docid: file?.doc_id, name: file?.basename, size: file?.size, doc_lib_type: file?.doc_lib_type },
            { isOpen: true },
        )

        const href = http.getBaseUrl() + url

        appProps?.openLocation(href)
    }

    /**
     * 预览
     */
    const handlePreview = async (file: EcoSearchInfo) => {
        if (!file?.extension) {
            handleOpenLocation(file)
        } else {
            const url = await getPreviewUrl({
                name: file?.basename + file?.extension,
                docid: file?.doc_id,
                size: file?.size,
                doc_lib_type: file?.doc_lib_type,
            })

            const href = http.getBaseUrl() + url

            appProps?.openLocation(href)
        }
    }

    /**
     * 点击加载更多
     */
    const handleLoadMore = async (item: DataItem) => {
        if (item?.next) {
            setData((prev) => prev?.map((d) => d?.id === item?.id ? ({
                ...d,
                moreLoading: true,
            }) : d))

            const { files = [], next } = await getData(item?.key, item?.next)

            setData((prev) => prev?.map((d) => d?.id === item?.id ? ({
                ...d,
                list: [...d?.list, ...files],
                next,
                moreLoading: false,
            }) : d))
        }
    }

    /**
     * 加载更多
     */
    const loadMore = (item: DataItem) => {
        if (!item.loading && !item.moreLoading) {
            return (
                <div className={styles['load-more']}>
                    {
                        item?.list?.length < Number(item?.total) ?
                            <Button
                                type={'link'}
                                onClick={() => handleLoadMore(item)}
                            >
                                {__('加载更多')}
                            </Button>
                            :
                            item?.list?.length ?
                                <span className={styles['all']}>{__('已完成全部文档扫描，综上为您的可见文档。')}</span>
                                : null
                    }
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <div className={styles['search']}>
            <div className={styles['search-result']}>
                <div className={styles['result-wrapper']}>
                    {
                        data.length ?
                            data.map((dataItem) => (
                                <List
                                    key={dataItem?.id}
                                    loading={dataItem?.loading}
                                    loadMore={loadMore(dataItem)}
                                    header={<div className={styles['list-title']}>{__('搜索关键字：')}{dataItem?.key}</div>}
                                    dataSource={dataItem?.list}
                                    footer={dataItem?.moreLoading ?
                                        (<Skeleton
                                            avatar={true}
                                            active={true}
                                            title={false}
                                            paragraph={{ rows: 3 }}
                                            loading={dataItem?.moreLoading}
                                        />) : null
                                    }
                                    renderItem={(item) => {
                                        const FileIcon = getFileIcon({ name: item?.extension, size: item?.size, doc_lib_type: item?.doc_lib_type, doc_type: item?.doc_type?.[0] })

                                        return (
                                            <List.Item
                                                key={item?.doc_id}
                                                className={styles['res-item']}
                                            >

                                                <List.Item.Meta
                                                    avatar={(
                                                        <FileIcon
                                                            style={{ fontSize: 24, cursor: 'pointer' }}
                                                            onClick={() => handlePreview(item)}
                                                        />
                                                    )}
                                                    title={(
                                                        <div
                                                            className={styles['res-title']}
                                                            onClick={() => handlePreview(item)}
                                                        >
                                                            <span
                                                                className={classNames(styles['search-label'])}
                                                                dangerouslySetInnerHTML={{ __html: item?.highlight?.basename?.[0] }}
                                                                title={item?.basename + item?.extension}
                                                            />
                                                            {item?.extension}
                                                        </div>
                                                    )}
                                                    description={(
                                                        <div className={styles['file']}>
                                                            {
                                                                !!item?.highlight?.content?.length && (
                                                                    <div
                                                                        style={{ color: '#000' }}
                                                                        className={styles['file-content']}
                                                                    >
                                                                        <span
                                                                            className={styles['search-label']}
                                                                            dangerouslySetInnerHTML={{ __html: item?.highlight?.content?.[0] || '' }}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                            <div className={styles['file-info']}>
                                                                <span>{`${item?.modified_by} ${__('修改于')} ${dayjs(item.modified_at / 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
                                                                {
                                                        item?.size !== -1 && (
                                                                        <span>{formatSize(item?.size)}</span>
                                                                    )
                                                                }
                                                            </div>
                                                            <Button
                                                                type={'link'}
                                                                className={styles['file-path']}
                                                                icon={<OpenlocationOutlined />}
                                                                onClick={() => handleOpenLocation(item)}
                                                            >
                                                                <span className={styles['path-name']}>
                                                                    {item?.parent_path.replace('gns://', '')}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    )}
                                                />
                                            </List.Item>
                                        )
                                    }}
                                />

                            ))
                            :
                            (
                                <Result
                                    style={{ paddingTop: 120 }}
                                    icon={<NoDataIcon />}
                                    title={null}
                                    subTitle={<div className={styles['no-data']}>{__('请输入搜索关键字')}</div>}
                                />
                            )
                    }
                    {
                        (!!data.length && !data[data.length-1].loading)?
                            (
                                <div className={styles['res-option']}>
                                    <Button
                                        style={{ width: '100%' }}
                                        icon={<CloseCircleOutlined />}
                                        onClick={handleClear}
                                    >
                                        {__('清除')}
                                    </Button>
                                </div>
                            )
                            : null
                    }
                </div>
            </div>
            <div className={styles['input-wrapper']}>
                {
                    wrapSSR(
                        <div className={classNames(styles['input-box'], 'input-box', hashId, { ['input-focus']: focus })}>
                            <Input.TextArea
                                style={{ padding: 0, borderRadius: 0 }}
                                autoSize={{ minRows: focus ? 3 : 2, maxRows: 3 }}
                                variant={'borderless'}
                                placeholder={__('请输入关键字...')}
                                value={value}
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                onChange={(e) => handleChange(e.target.value)}
                                onPressEnter={(e) => { handleSearch(value); e.preventDefault()}}
                            />
                            <div className={styles['input-set']}>
                                <Tooltip placement={'top'} title={__('发送（↵）')} color={'#737373d9'}>
                                    <SendOutlined
                                        className={classNames(styles['send-icon'], 'send-icon', hashId)}
                                        onClick={() => handleSearch(value)}
                                    />
                                </Tooltip>
                            </div>
                        </div>,
                    )
                }
            </div>
        </div>
    )
}

export default Search
