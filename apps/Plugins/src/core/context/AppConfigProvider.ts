import { createContext } from 'react'

interface AppConfigProps {
    lang?: string;
    theme?: string;
    userInfo?: Record<string, any>;
    domainInfo?: Record<string, string>;
    updateDomainInfo?: (domainInfo: Record<string, string>) => void;
}

const AppConfigContext = createContext<AppConfigProps>({})

export default AppConfigContext