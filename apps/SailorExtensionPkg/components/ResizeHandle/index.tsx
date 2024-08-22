import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { Resizable } from 'react-resizable'
import styles from './style.module.css'

interface ResizeHandleProps extends React.HTMLAttributes<HTMLDivElement> {
    width: number;
    onChangeWidth: (width: number) => void;
}

const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(({
    width,
    onChangeWidth,
    children,
    ...props
}, ref) => {
    const [isResizing, setIsResizing] = useState(false)

    /**
     * 调整抽屉宽度
     */
    const handleResize = (e:React.SyntheticEvent, data: any) => {
        const { size } = data

        onChangeWidth?.(size?.width)
    }

    return (
        <Resizable
            onResize={handleResize}
            width={width}
            height={window.innerHeight}
            handle={<div
                ref={ref}
                style={{ width: isResizing? '100%' : '10px' }}
                className={classNames(styles['handle-bar'])}
                {...props}
            />}
            axis={'x'}
            resizeHandles={['w']}
            minConstraints={[510, 0]}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={() => setIsResizing(false)}
        >
            {children}
        </Resizable>

    )
})

export default ResizeHandle