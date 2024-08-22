import { useState } from 'react'
import { Tooltip, Modal } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import Language from '../Language'
import __ from './locale'

interface SettingProps {
    getContainer?: () => HTMLElement;
    onChangeLang: (lang: string) => void
    defaultLang: string;
}

const Setting = ({
    getContainer,
    onChangeLang,
    defaultLang,
}: SettingProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Tooltip placement={'left'} title={__('设置')} color={'#737373d9'}>
                <SettingOutlined onClick={() => setOpen(true)}/>
            </Tooltip>
            <Modal
                open={open}
                getContainer={getContainer}
                width={300}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Language
                    defaultLang={defaultLang}
                    onChange={onChangeLang}
                />
            </Modal>
        </>
    )
}

export default Setting