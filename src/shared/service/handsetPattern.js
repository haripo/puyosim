
export function generateHandsetPatterns(hand: number): Array<string> {
  if (hand === 2) {
    return [
      'AA AA',
      'AA AB',
      'AA BB',
      'AA BC',

      'AB AA',
      'AB AB',
      'AB AC',
      'AB CC',
      'AB CD'
    ]
  } else {
    return [
    ]
  }
}

export function handsetStrToColors(pattern: string): Array<number> {
  let result = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === ' ') {
      continue;
    }
    result.push(pattern[i].charCodeAt() - 'A'.charCodeAt() + 1);
  }
  return result;
}