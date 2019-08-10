import * as dayjs from 'dayjs';
import { timestampFormat } from '../configs/constants';

export const isHexColorFormat = (hex: string): boolean => /^#[0-9A-F]{3,6}$/i.test(hex);

export const isValidTimestampFormat = (date: string): boolean => dayjs(date, timestampFormat).isValid();
