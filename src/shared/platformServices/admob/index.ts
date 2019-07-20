// @ts-ignore
import * as platform from './platform';

export interface InterstitialAdInterface {
  constructor(unitId: string);
  load();
  show();
}

export interface AdInterface {
  show(): void;
}

export const reloadAd: AdInterface = platform.reloadAd;