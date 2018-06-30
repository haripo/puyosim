import { calcChainStepScore } from './score';
import { Stack, Position, Color } from './stack';

export type DroppingPlan = {
  row: number,
  col: number,
  color: Color,
  distance: number
}

export type VanishingPlan = {
  puyos: Position[],
  color: Color
}

export type ChainPlan = {
  plan: (DroppingPlan | VanishingPlan)[][],
  score: number,
  chain: number
}

/**
 * Generate dropping plans, modifying stack
 * @param stack stack object
 * @param rows stack size
 * @param cols stack size
 * @returns {Array} plans
 */
export function getDropPlan(stack: Stack, rows: number, cols: number): DroppingPlan[] {
  let plan: DroppingPlan[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = rows - 1; 0 < j; j--) {
      if (stack[j][i] !== 0) {
        continue;
      }
      let to = j;
      let from = j;
      while (0 <= from && stack[from][i] === 0) {
        from--;
      }
      if (0 <= from) {
        stack[to][i] = stack[from][i];
        stack[from][i] = 0;
        plan.push({
          row: to,
          col: i,
          color: stack[to][i] as Color,
          distance: to - from
        });
      }
    }
  }
  return plan;
}

/**
 * Generate vanishing plans, modifying stack
 * @param stack
 * @param rows
 * @param cols
 * @returns {Array}
 */
export function getVanishPlan(stack: Stack, rows: number, cols: number): VanishingPlan[] {
  const connections = getConnections(stack, rows, cols).filter(c => c.puyos.length >= 4);

  if (connections.length === 0) {
    return [];
  }

  let plan: VanishingPlan[] = [];

  connections.forEach(connection => {
    plan.push(connection);
    connection.puyos.forEach(puyo => {
      stack[puyo.row][puyo.col] = 0;
    });
  });

  return plan;
}

function getConnections(stack: Stack, rows: number, cols: number) {
  let connectionIds = Array(rows).fill(null).map(() => Array(cols).fill(0));

  const search = (r, c, puyo) => {
    // puyos on row = 0 do not be connected nor vanished.
    if (1 <= r && r < rows && 0 <= c && c < cols &&
        puyo === stack[r][c] &&
        !connectionIds[r][c]) {
      connectionIds[r][c] = id;
      search(r - 1, c, puyo);
      search(r, c - 1, puyo);
      search(r + 1, c, puyo);
      search(r, c + 1, puyo);
    }
  };

  let result: { color: Color, puyos: Position[] }[] = [];
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (stack[row][col] === 0) continue;
      if (connectionIds[row][col] === 0) {
        id++;
        search(row, col, stack[row][col]);

        connectionIds[row][col] = id;
        result[id - 1] = {
          color: stack[row][col] as Color,
          puyos: [{ row, col }]
        };
      } else {
        result[connectionIds[row][col] - 1].puyos.push({ row, col });
      }
    }
  }

  return result;
}

export function createChainPlan(stack: Stack, rows: number, cols: number): ChainPlan {
  let result = {
    plan: [] as (VanishingPlan | DroppingPlan)[][],
    score: 0,
    chain: 0
  };

  while (true) {
    const vanishPlans = getVanishPlan(stack, rows, cols);

    if (vanishPlans.length === 0) {
      break;
    }

    result.plan.push(vanishPlans);

    result.chain += 1;
    result.score += calcChainStepScore(result.chain, vanishPlans);

    const dropPlans = getDropPlan(stack, rows, cols);
    result.plan.push(dropPlans);
  }

  return result;
}
