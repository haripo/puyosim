
const colorToNumber = {
  ' ': 0,
  'R': 1,
  'P': 2,
  'G': 3,
  'B': 4
};

const kennRPattern =
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

export const kennR = (i) => colorToNumber[kennRPattern[i]];
export const snake = (i) => colorToNumber[snakePattern[i]];