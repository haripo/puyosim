import { fieldRows, fieldCols } from "../utils/constants";
import { appendHistoryRecord, createHistoryRecord, History } from "./history";
import { Stack } from "./stack";
import { Rotation } from "./move";

const colorToNumber = {
  ' ': 0,
  'R': 1,
  'P': 2,
  'G': 3,
  'B': 4
};

const kennyPattern =
  '  RPGG' +
  'RBBRPB' +
  'PBRPGG' +
  'RBRPGB' +
  'PGBRPB' +
  'GBRPGB' +
  'PGBRPG' +
  'PGBRPG' +
  'PRRBRB' +
  'RGBPBB' +
  'PRGBPR' +
  'PRGBPR' +
  'PRGBPR';

const snakePattern =
  ' G G  ' +
  ' B GR ' +
  'BG BRG' +
  'GR GGR' +
  'GR GBR' +
  'RG RRG' +
  'RG RGR' +
  'GB GBG' +
  'BR BGB' +
  'GR GBG' +
  'GR RRG' +
  'RPPPPR' +
  'GGGRGG';

function setPattern(stack: Stack, pattern: string): Stack {
  for (let i = 0; i < fieldRows * fieldCols; i++) {
    stack[Math.floor(i / 6)][i % 6] = colorToNumber[pattern[i]];
  }
  return stack;
}

export function setPatternByName(stack: Stack, name: string): Stack {
  switch (name) {
    case 'kenny':
      return setPattern(stack, kennyPattern);
    case 'snake':
      return setPattern(stack, snakePattern);
  }
  throw 'Not implemented';
}


// > store.dispatch({ type: 'DEBUG_SET_HISTORY' })
export function setRandomHistory(history: History, stack: Stack): History {
  for (let i = 0; i < 100; i++) {
    const move = { col: Math.floor(Math.random() * 6), rotation: 'top' as Rotation };
    const hand = [i % 4 + 1, (i + 1) % 4 + 1];
    const record = createHistoryRecord(
      move,
      hand,
      i,
      stack,
      0,
      0,
      0);
    appendHistoryRecord(history, record);

    if (10 < i && Math.floor(Math.random() * 5) === 0) {
      history.currentIndex -= Math.floor(Math.random() * 10);
    }
  }
  return history;
}