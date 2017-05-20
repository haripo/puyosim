
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

function getConnectionBonus(connection) {
  return connectionBonusTable[connection < 7 ? connection - 4 : 7]
}

function getColorBonus(colorCount) {
  return colorBonusTable[colorCount - 1]
}

function getChainBonus(chainCount) {
  return chainBonusTable[chainCount - 1]
}



