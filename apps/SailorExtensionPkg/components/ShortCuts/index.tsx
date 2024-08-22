import { useState, useEffect } from 'react'
import { Button } from 'antd'
import { NavInfo } from '@/composables/apis'
import type { ActiveNav } from '@/composables/types'
import Logo from '../Logo'
import styles from './style.module.css'

interface ShortCutsProps {
    navs?: NavInfo[];
    onActive: (arg: ActiveNav) => void
}

const ShortCuts = ({
    navs,
    onActive,
}: ShortCutsProps) => {
    const [selectedText, setSelectedText] = useState<{ text: string; x: number; y: number }>({ text: '', x: 0, y: 0 })

    const listener = (e: MouseEvent) => {
        if (window?.getSelection()?.toString()) {
            setSelectedText({
                text: window?.getSelection()?.toString() || '',
                x: e.clientX - 20,
                y: e.clientY + 10,
            })
        } else {
            setSelectedText({ text: '', x: 0, y: 0 })
        }
    }

    useEffect(() => {
        // 选中文字后弹出图标
        window.addEventListener('mouseup', listener)

        return () => {
            window.removeEventListener('mouseup', listener, false)
        }
    }, [])

    /**
     * 激活菜单
     */
    const active = (nav?: NavInfo) => {
        setSelectedText(() => ({ text: '', x: 0, y: 0 }))

        onActive?.({ nav: nav || {} as NavInfo, text: selectedText?.text })
    }

    return (selectedText.x !== 0 || selectedText.y !== 0) ? (
        <div
            className={styles['sailor-shortcuts']}
            style={{ transform: `translate(${selectedText.x}px, ${selectedText.y}px)` }}
        >
            <Button.Group
                className={styles['shortcuts-group']}
            >
                {
                    navs?.length ?
                        navs?.map((info, index) => (
                            <Button
                                key={info?.id}
                                type={'text'}
                                icon={index === 0 ? <Logo  style={{ fontSize: 20 }} /> : <span dangerouslySetInnerHTML={{ __html: info?.iconSvg }} className={styles['logo']} />}
                                onClick={() => active(info)}
                            />
                        ))
                        :
                        <Button
                            key={'logo'}
                            type={'text'}
                            icon={<Logo  style={{ fontSize: 20 }} />}
                            onClick={() => active()}
                        />
                }
            </Button.Group>
        </div>
    )
        : null
}

export default ShortCuts