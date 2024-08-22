import { findIndex } from 'lodash-es'

/**
 * 转换字节数
 * @param bytes 字节大小
 * @param units 单位集合
 * @param minUnit 最小单位
 * @return size 大小 unit单位
 */
export function transformBytes(bytes: number, { minUnit = 'B' } = {} as { minUnit: string }): [number, string] {
    // 单位集合
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB'];
    // 最小显示单位
    const minUnitIndex = findIndex(units, (value: string) => value === minUnit);
    // 下标，用来计算适合单位的下标
    let index;
    for (index = minUnitIndex; index <= units.length; index++) {
        if (index === units.length - 1 || bytes < Math.pow(1024, index + 1)) {
            break;
        }
    }
    return [bytes / Math.pow(1024, index), units[index]];
}

/**
 * 大小格式化
 * @param bytes 字节大小
 * @param fixed 保留位数 minUnit 最小显示单位
 * @return 返回格式化后的大小字符串
 */
export function formatSize(bytes: number, fixed: number = 2, { minUnit = 'B' } = {} as { minUnit: string }): string {
    if (bytes === undefined) {
        return ''
    }

    const [size, unit] = transformBytes(bytes, { minUnit })

    if (bytes === size) {
        return size + unit;
    } else {
        const sizeStr = size.toString()

        // 不能使用toFixed(fixed)，会导致类似4.99998被入为5.00
        if (sizeStr.indexOf('.') === -1) {
            return sizeStr + unit
        } else {
            const indexOfPoint = sizeStr.indexOf('.');
            return sizeStr.slice(0, indexOfPoint + fixed + 1) + unit;
        }
    }
}

/**
 * 速率格式化
 * @param bytes 字节大小
 * @param fixed 保留位数 minUnit 最小显示单位
 * @return 返回格式化后的大小字符串
 */
export function formatRate(bytes: number, fixed: number = 2, { minUnit = 'B' } = {} as { minUnit: string }): string {
    if (bytes === undefined) {
        return ''
    }
    const [size, unit] = transformBytes(bytes, { minUnit });
    return size.toFixed(fixed) + unit + '/s';
}