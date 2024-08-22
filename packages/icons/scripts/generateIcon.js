const fs = require("fs")
const path = require("path")
const clean = require("del");
const { promisify } = require("util")
const { template } = require("lodash")

const render = template(`
// GENERATE BY ./scripts/generateIcon.js
// DON NOT EDIT IT MANUALLY
import * as React from 'react';
import Icon from '@ant-design/icons';
import { IconComponentProps, CustomIconComponentProps } from '@ant-design/icons/es/components/Icon';
import { ReactComponent as <%= svgIdentifier %>Svg } from '../svg/<%= type %>/<%= svgIcon %>';

const <%= svgIdentifier %> = (props: Partial<IconComponentProps>, ref: React.MutableRefObject<HTMLSpanElement>) => {

  return (
    <Icon
      ref={ref as any}
      component={(svgProps: CustomIconComponentProps) => <<%= svgIdentifier %>Svg {...svgProps} />}
      {...props}
    />
  )
}

<%= svgIdentifier %>.displayName = '<%= svgIdentifier %>';

export default React.forwardRef<HTMLSpanElement, Partial<IconComponentProps>>(<%= svgIdentifier %>);
`.trim());

async function generateIcon(type) {
    const files = await promisify(fs.readdir)(path.join(__dirname, `../src/svg/${type}`))

    files.map(async (file) => {
        const name = path.basename(file, ".svg")
        const iconName = name.charAt(0).toUpperCase() +
            name.replace(/-\w/g, (s) => s.slice(1).toUpperCase()).slice(1) +
            type.replace(/\b\w/g, (s) => s.toUpperCase())

        const svgIcon = path.basename(file)

        await promisify(fs.writeFile)(
            path.resolve(__dirname, `../src/svgr/${iconName}.tsx`),
            render({ svgIdentifier: iconName, svgIcon: svgIcon, type }),
        )

        await promisify(fs.appendFile)(
            path.resolve(__dirname, "../src/svgr/index.tsx"),
            `export { default as ${iconName} } from './${iconName}';\n`,
        )
    })
}

async function generateIcons() {
    const iconsDir = path.join(__dirname, "../src/svgr");

    try {
        await clean(iconsDir)
        await promisify(fs.access)(iconsDir);
    } catch (err) {
        await promisify(fs.mkdir)(iconsDir);
    }

    await generateIcon("colored")
    await generateIcon("filled")
    await generateIcon("outlined")
}

generateIcons()
