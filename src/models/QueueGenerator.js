import _ from 'lodash';

function swapColors(queue: Array<number>, a: number, b: number) {
  const buf = queue[a];
  queue[a] = queue[b] || 1;
  queue[b] = buf || 1;
  return queue;
}

function rearrangeQueue(queue, tabooColors: Set<number>, limitLength) {
  for (let i = 0; i < limitLength; i++) {
    if (tabooColors.has(queue[i])) {
      const target = _.findLastIndex(queue, color => !tabooColors.has(color));
      swapColors(queue, i, target);
    }
  }
  return queue;
}


/// 初手配色制限
function limitInitialColors(queue: Array<number>, numColorLimit: number, limitLength: number) {
  const colors = new Set(queue);
  const tabooColors = colors.subtract(queue.slice(0, limitLength));
  return rearrangeQueue(queue, tabooColors, limitLength);
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

  if (configs.initialAllClear === 'avoidIn2Hands') {
    if (queue[0] === queue[1] &&
      queue[0] === queue[2] &&
      queue[0] === queue[3]) {
      return this.generateQueue(configs);
      // TODO: avoid4ColorsIn3Hands の処理を抽象化すればこれもできそう
    }
  }

  return _.chunk(queue, 2);
}
