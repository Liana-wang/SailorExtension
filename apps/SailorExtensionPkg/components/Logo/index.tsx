import Icon from '@ant-design/icons'
import LogoSvg from '@/assets/logo.svg?react'

interface LogoProps {
    style?: React.CSSProperties;
    [key: string]: any;
}

const Logo = (props: LogoProps) => {
    return (
        <Icon component={LogoSvg} {...props} />
    )
}

export default Logo