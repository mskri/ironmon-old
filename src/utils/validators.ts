export const isHexColorFormat = (hex: string): boolean => /^#[0-9A-F]{3,6}$/i.test(hex);
