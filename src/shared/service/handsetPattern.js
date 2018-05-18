export let handsetPatterns = [
  [
    'AA', 'AB'
  ],
  [
    'AA', 'AB', 'AC',
    'BB', 'BC',
    'CC', 'CD'
  ],
  [
    'AA', 'AB', 'AC', 'AD', 'AE',
    'BB', 'BC', 'BD', 'BE',
    'CC', 'CD', 'CE',
    'DD', 'DE',
    'EE'
  ]
];

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
