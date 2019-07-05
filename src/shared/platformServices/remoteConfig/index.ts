// @ts-ignore
import * as platform from './platform';

export const getMinimumSupportedAppVersion: () => Promise<string | null> = platform.getMinimumSupportedAppVersion;