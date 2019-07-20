// @ts-ignore
import * as platform from './platform';

export const captureException: (e: Error) => void = platform.captureException;