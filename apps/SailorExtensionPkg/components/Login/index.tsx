import { useState } from 'react'
import { noop } from 'lodash-es'
import type { FormProps } from 'antd'
import { Button, Form, Select, Input, InputNumber } from 'antd'
import { setStorage, EnumOpenWinMsgId, EnumStorageKey, EnumDomainInfo } from '@/composables'
import __ from './locale'
import Logo from '@/assets/logo.svg?react'
import styles from './style.module.css'

enum ViewType {
    Welcome = 'Welcome',
    Config = 'Config',
    Login = 'Login',
}

type ConfigFieldType = {
    protocol: string;
    ip: string;
    port: number;
    prefix: string;
}

interface LoginProps {
    domainInfo?: Record<EnumDomainInfo, string>;
    loginSusccess: () => void;
}

const Login = ({
    domainInfo,
    loginSusccess = noop,
}: LoginProps) => {
    const [view, setView] = useState(ViewType.Welcome)

    const changeView = (type: ViewType) => {
        setView(type)
    }

    const onFinishConfig: FormProps<ConfigFieldType>['onFinish'] = async (values) => {
        const { protocol, ip, port, prefix } = values
        const win = window.open(
            `${protocol}://${ip}:${port}${prefix}`,
            'mozillaWindow',
            'left=200,top=100,width=1120,height=800',
        )

        window.addEventListener('message', async (event) => {
            if (event.data.id === EnumOpenWinMsgId.OauthStart) {
                win?.postMessage({ id: EnumOpenWinMsgId.OauthLogin }, '*')
            }

            if (event.data.id === EnumOpenWinMsgId.OauthSuccess) {
                win?.close()

                await setStorage({
                    [EnumStorageKey.DomainIfon]: {
                        protocol,
                        ip,
                        port,
                        prefix,
                    },
                })

                loginSusccess()
            }
        }, false)
    }

    return (
        <div className={styles['login-container']}>
            <div className={styles['main']}>
                <div className={styles['logo']}><Logo /></div>
                <div className={styles['tip']}>{__('欢迎来到知识助手web平台')}</div>
                {
                    view === ViewType.Welcome && (
                        <Button
                            type={'primary'}
                            style={{ width: '70%' }}
                            onClick={() => changeView(ViewType.Config)}
                        >
                            {__('登录')}
                        </Button>
                    )
                }
                {
                    view === ViewType.Config && (
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ width: '100%' }}
                            onFinish={onFinishConfig}
                            initialValues={{
                                protocol: domainInfo?.protocol || 'https',
                                ip: domainInfo?.ip || '',
                                port: domainInfo?.port || 443,
                                prefix: domainInfo?.prefix || '/',
                            }}
                            autoComplete={'off'}
                        >
                            <Form.Item<ConfigFieldType>
                                label={__('协议类型')}
                                name={'protocol'}
                                rules={[{ required: true, message: __('此项不允许为空') }]}
                            >
                                <Select
                                    options={[
                                        { value: 'http', label: 'HTTP' },
                                        { value: 'https', label: 'HTTPS' },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item<ConfigFieldType>
                                label={__('文档域地址')}
                                name={'ip'}
                                rules={[{ required: true, message: __('此项不允许为空') }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<ConfigFieldType>
                                label={__('文档域端口')}
                                name={'port'}
                                rules={[{ required: true, message: __('此项不允许为空') }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={65535}
                                />
                            </Form.Item>
                            <Form.Item<ConfigFieldType>
                                label={__('访问前缀')}
                                name={'prefix'}
                                rules={[{ required: true, message: __('此项不允许为空') }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type={'primary'} htmlType={'submit'} style={{ width: '100%' }}>
                                    {__('确定')}
                                </Button>
                            </Form.Item>
                        </Form>
                    )
                }
            </div>
        </div>
    )
}

export default Login