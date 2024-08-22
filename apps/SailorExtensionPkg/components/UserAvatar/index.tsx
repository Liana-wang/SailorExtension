import { useRef } from 'react';
import { Avatar, Dropdown } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { logout } from '@/composables/apis'
import type { UserInfo } from '@/composables/apis'
import __ from './locale'
import styles from './style.module.css'

interface AvatarProps {
    userInfo: UserInfo | null;
    onLogoutSusccess?: () => void;
}

const getAvatar = (userInfo: UserInfo | null, size: number = 32) => {
    return (
        userInfo?.avatar_url ?
            (
                <Avatar
                    src={userInfo?.avatar_url}
                    size={size}
                />
            )
            :
            <Avatar
                size={size}
                style={{ backgroundColor: '#4A5C9B' }}
            >
                {userInfo?.name?.charAt(0)}
            </Avatar>
    )
}

const UserAvatar = ({
    userInfo = null,
    onLogoutSusccess,
}: AvatarProps) => {
    const popContainer = useRef<HTMLDivElement>(null)

    /**
     * 退出登录
     */
    const doLogout = async () => {
        await logout()
        onLogoutSusccess?.()
    }

    return (
        <div className={styles['user-info']} ref={popContainer}>
            {
                !!userInfo && (
                    <Dropdown
                        placement={'topRight'}
                        getPopupContainer={() => popContainer.current as HTMLDivElement}
                        overlayStyle={{ width: 220 }}
                        menu={{
                            items: [
                                {
                                    key: 'user-info',
                                    disabled: true,
                                    label: (
                                        <div className={styles['user-info-avatar']}>
                                            {
                                                getAvatar(userInfo, 40)
                                            }
                                            <div className={styles['avatar-info']}>
                                                <div>{userInfo?.name}</div>
                                                <div
                                                    className={styles['avatar-dep']}
                                                    title={userInfo?.mail}
                                                >
                                                    {userInfo?.mail}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    type: 'divider',
                                },
                                {
                                    key: 'logout',
                                    label: __('退出'),
                                    icon: <LogoutOutlined />,
                                    onClick: doLogout,
                                },
                            ],
                        }}
                    >
                        {
                            getAvatar(userInfo, 32)
                        }
                    </Dropdown>
                )
            }
        </div>

    )
}

export default UserAvatar