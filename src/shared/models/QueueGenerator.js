import _ from 'lodash';
import { handsetStrToColors } from '../service/handsetPattern';

function swapColors(queue: Array<number>, a: number, b: number) {
  const buf = queue[a];
  queue[a] = queue[b] || 1;
  queue[b] = buf || 1;
  return queue;
}

/**
 * 与えられた条件で配色制限を満たすように Queue を編集します
 * @param queue
 * @param tabooColors 制限色
 * @param limitLength 制限範囲のぷよ数
 * @returns {Array<number>} modified queue
 */
function rearrangeQueue(queue: Array<number>, tabooColors: Set<number>, limitLength) {
  for (let i = 0; i < limitLength; i++) {
    if (tabooColors.has(queue[i])) {
      const target = _.findLastIndex(queue, color => !tabooColors.has(color));
      if (limitLength < target) {
        swapColors(queue, i, target);
      } else {
        queue[i] = 1;
      }
    }
  }
  return queue;
}


/// 初手配色制限
export function limitInitialColors(
  queue: Array<number>,
  numColorLimit: number,
  numLimitPairs: number) {

  let appeared = new Set();
  for (let i = 0; i < numLimitPairs * 2; i++) {
    appeared.add(queue[i]);
    if (numColorLimit <= appeared.size) {
      break;
    }
  }

  const taboos = new Set(queue.filter(color => !appeared.has(color)));
  return rearrangeQueue(queue, taboos, numLimitPairs * 2);
}

/**
 * Create queue
 */
export function generateQueue(configs) {
  let queue = [];
  if (configs.colorBalance === '128') {
    for (let i = 0; i < 128 * 2; i++) {
      queue.push(Math.floor(Math.random() * 4) + 1);
    }
  } else {
    for (let i = 0; i < 8; i++) {
      let subQueue = [];
      for (let j = 0; j < 16 * 2; j++) {
        subQueue.push(j % 4 + 1);
      }
      queue = queue.concat(_.shuffle(subQueue));
    }
  }

  if (configs.initialColors === 'avoid4ColorsIn3Hands') {
    limitInitialColors(queue, 3, 3);
  }

  if (configs.initialColors === 'avoid4ColorsIn2Hands') {
    limitInitialColors(queue, 3, 2);
  }

  if (configs.initialColors === 'specifyHands') {
    if (configs.specify1stHand) {
      const hand = handsetStrToColors(configs.specify1stHand);
      queue[0] = hand[0];
      queue[1] = hand[1]
    }
    if (configs.specify2ndHand) {
      const hand = handsetStrToColors(configs.specify2ndHand);
      queue[2] = hand[2];
      queue[3] = hand[3];
    }
    if (configs.specify3rdHand) {
      const hand = handsetStrToColors(configs.specify3rdHand);
      queue[4] = hand[4];
      queue[5] = hand[5];
    }
  }

  if (configs.initialAllClear === 'avoidIn2Hands') {
    if (queue[0] === queue[1] &&
      queue[0] === queue[2] &&
      queue[0] === queue[3]) {
      return generateQueue(configs);
    }
  }

  return _.chunk(queue, 2);
}
