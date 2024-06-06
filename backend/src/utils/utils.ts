export function isNull(obj: any): boolean {
    return obj === null || typeof obj === 'undefined';
}

export function isStringEmpty(str: string): boolean {
    return isNull(str) && str.length === 0;
}