declare module '*.svg' {
  import React from 'react';
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module '*.json' {
  const value: any;
  export const version: string;
  export default value;
}

declare module '*.gif';

declare module '*.jpg';

declare module '*.jpeg';

declare module '*.png';

declare module '*.css';

interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
    Zone?: CallableFunction;
}
