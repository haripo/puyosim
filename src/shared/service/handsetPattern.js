
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
      'AA AA AA',
      'AA AA AB',
      'AA AA BB',
      'AA AA BC',
      'AA AB AA',
      'AA AB AC',
      'AA AB BB',
      'AA AB CC',
      'AA AB AB',
      'AA AB BC',
      'AA AB CD',
      'AA BB AA',
      'AA BB AB',
      'AA BB AC',
      'AA BB BB',
      'AA BB BC',
      'AA BB CC',
      'AA BB CD',
      'AA BC AA',
      'AA BC AB',
      'AA BC AD',
      'AA BC BB',
      'AA BC BC',
      'AA BC BD',
      'AA BC DD',
      'AB AA AA',
      'AB AA AB',
      'AB AA AC',
      'AB AA BB',
      'AB AA BC',
      'AB AA CC',
      'AB AA CD',
      'AB AB AA',
      'AB AB AB',
      'AB AB AC',
      'AB AB CC',
      'AB AB CD',
      'AB AC AA',
      'AB AC AB',
      'AB AC AC',
      'AB AC AD',
      'AB AC BB',
      'AB AC BC',
      'AB AC BD',
      'AB AC CC',
      'AB AC CD',
      'AB AC DD',
      'AB CC AA',
      'AB CC AB',
      'AB CC AC',
      'AB CC AD',
      'AB CC CC',
      'AB CC CD',
      'AB CC DD',
      'AB CD AA',
      'AB CD AB',
      'AB CD AC',
      'AB CD CC',
      'AB CD CD'
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

