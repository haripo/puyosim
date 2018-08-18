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

export function handsetStrToColors(pattern: string): number[] {
  let result: number[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === ' ') {
      continue;
    }
    result.push(pattern[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1);
  }
  return result;
}
