import _ from 'lodash';
import { VanishingPlan } from "./chainPlanner";

const chainBonusTable = [
  0,
  8,
  16,
  32,
  64,
  96,
  128,
  160,
  192,
  224,
  256,
  288,
  320,
  352,
  384,
  416,
  448,
  480,
  512
];

const connectionBonusTable = [
  0,
  2,
  3,
  4,
  5,
  6,
  7,
  10
];

const colorBonusTable = [
  0,
  3,
  6,
  12,
  24
];

function getConnectionBonus(vanished: VanishingPlan[]): number {
  return _.sum(vanished
    .map(c => {
      const connection = c.puyos.length;
      return connectionBonusTable[connection < 11 ? connection - 4 : 7];
    }));
}

function getColorBonus(vanished: VanishingPlan[]): number {
  const colorCount = _.uniq(vanished.map(c => c.color)).length;
  return colorBonusTable[colorCount - 1];
}

function getChainBonus(chainCount: number): number {
  return chainBonusTable[chainCount - 1];
}

export function calcChainStepScore(chainCount: number, vanishingPlans: VanishingPlan[]): number {
  const vanished = vanishingPlans.filter(c => c.puyos.length >= 4);
  const score = 10 * vanished.reduce((acc, c) => acc + c.puyos.length, 0) * (
    getConnectionBonus(vanished) +
    getColorBonus(vanished) +
    getChainBonus(chainCount));
  return score === 0 ? 40 : score;
}

