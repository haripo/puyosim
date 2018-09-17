import _ from 'lodash';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * The maximum of color number that serializer can handle
 */
const maxColor = 7;

/**
 * Serialize queue into string
 * @param queue color array
 */
export function serializeQueue(queue: number[]): string {
  if (queue.length % 2 !== 0) {
    throw new Error('The length of queue must be even');
  }

  if (queue.find(c => (c < 0 || maxColor <= c)) !== undefined) {
    throw new Error('Invalid color in queue: [' + queue.join(',') + ']');
  }

  return _.chunk(queue, 2)
    .map(pair => chars[pair[0] * maxColor + pair[1]])
    .join('');
}

/**
 * Deserialize queue from string
 * @param serializedQueue string queue
 */
export function deserializeQueue(serializedQueue: string): number[] {
  const pairNumbers = serializedQueue
    .split('')
    .map(char => chars.indexOf(char));

  if (pairNumbers.find(num => num === -1) !== undefined) {
    throw new Error('Invalid char in serialized queue: [' + serializedQueue + ']')
  }

  return _.flatMap(pairNumbers, n => [Math.floor(n / maxColor), n % maxColor]);
}


export function serializeHistory(history: History): string {
  return '';
}