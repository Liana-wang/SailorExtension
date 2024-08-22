import { useState, useRef, useEffect } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { Button } from 'antd'
import Logo from '../Logo'
import styles from './style.module.css'

interface EntryBtnProps {
    onOpen: () => void
}

const EntryBtn = ({
    onOpen,
}: EntryBtnProps) => {
    const [bounds, setBounds] = useState({ top: 0, bottom: 0 })
    const [position, setPosition] = useState({ x: 0, y: 300 })
    const target = useRef<HTMLDivElement>(null)

    /**
     * 更新拖动范围
     */
    const updateBounds = () => {
        if (target.current) {
            setBounds({
                top: -Number(target.current?.offsetTop),
                bottom:
                    document.documentElement.clientHeight -
                    Number(target.current?.offsetHeight) -
                    Number(target.current?.offsetTop),
            })
        }
    }

    useEffect(() => {
        window.onresize = () => {
            updateBounds()

            if (document.documentElement.clientHeight < position.y) {
                setPosition({ x: 0, y: document.documentElement.clientHeight - Number(target.current?.offsetHeight) })
            }
        }
    }, [position])

    /**
     * 拖动结束
     */
    const dragStop: DraggableEventHandler = (e, data) => {
        if (data.y === position.y) {
            onOpen?.()
        }

        setPosition({ x: 0, y: data.y })
    }

    return (
        <Draggable
            axis={'y'}
            nodeRef={target}
            bounds={bounds}
            position={position}
            onStart={updateBounds}
            onStop={dragStop}
        >
            <div
                ref={target}
                className={styles['entry-group']}
            >
                <Button
                    icon={<Logo style={{ fontSize: 28 }} />}
                    className={styles['entry-btn']}
                    style={{ width: '100%' }}
                />
            </div>
        </Draggable>
    )
}

export default EntryBtn