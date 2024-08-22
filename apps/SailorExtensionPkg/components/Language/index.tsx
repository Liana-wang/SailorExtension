import { useEffect } from 'react'
import { noop } from 'lodash-es'
import { Select } from 'antd'
import { Languages } from '@sailor-extension/core'
import { setStorage, EnumStorageKey } from '@/composables'

interface LanguageProps {
    defaultLang?: string;
    onChange?: (lang: string) => void;
}

const Language = ({
    defaultLang = '',
    onChange = noop,
}: LanguageProps) => {
    useEffect(() => {
        setStorage({ [EnumStorageKey.Lang]: defaultLang })
    }, [])

    const setLang = async (value: string) => {
        await setStorage({ [EnumStorageKey.Lang]: value })
        onChange(value)
    }

    return (
        <Select
            style={{ width: 220 }}
            defaultValue={defaultLang}
            options={Languages}
            onChange={setLang}
        />
    )
}

export default Language