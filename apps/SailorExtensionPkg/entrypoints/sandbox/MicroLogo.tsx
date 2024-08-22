import type { NavInfo } from '@/composables/apis'
import styles from './style.module.css'

const MicroLogo = ({
    nav,
}: { nav?: NavInfo }) => {
    return (
        nav?.iconSvg ?
            (
                <div
                    className={styles['menu-item-icon']}
                    dangerouslySetInnerHTML={{ __html: nav.iconSvg }}
                />
            )
            :
            (
                <img
                    src={nav?.icon}
                    alt={nav?.name}
                    className={styles['menu-item-icon']}
                />
            )
    )
}

export default MicroLogo