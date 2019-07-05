// @ts-ignore
import * as platform from './platform';

export const loadConfig: () => Promise<any> = platform.loadConfig;
export const saveConfig: (key: string, value: string) => Promise<void> = platform.saveConfig;
