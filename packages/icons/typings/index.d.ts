declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

  export const src: string;
  export { ReactComponent };
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
