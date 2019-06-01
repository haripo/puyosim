import { fieldCols, fieldRows } from '../utils/constants';
import { Color, createField, getStackForRendering, isValidPosition, Stack, StackForRendering } from '../models/stack';
import { createSelector } from 'reselect';
import { FieldState } from "../reducers/field";
import { DroppingPlan } from "../models/chainPlanner";
import Field from "../components/Field";

export function isActive(state: FieldState): boolean {
  if (!state.droppingPuyos) return false;
  return !(
    state.droppingPuyos.length > 0 ||
    state.vanishingPuyos.length > 0
  );
}

export const getVanishingPuyos = createSelector(
  [(state: FieldState) => state.vanishingPuyos],
  _getVanishingPuyos
);

function _getVanishingPuyos(vanishings) {
  let field = createField(fieldRows, fieldCols);

  for (let plan of vanishings) {
    for (let puyo of plan.puyos) {
      field[puyo.row][puyo.col] = plan.color;
    }
  }

  const hasConnection = (row, col, color) => {
    return isValidPosition({ row, col }) && field[row][col] === color;
  };

  let result: any[] = [];

  for (let plan of vanishings) {
    for (let puyo of plan.puyos) {
      const row = puyo.row;
      const col = puyo.col;
      const color = plan.color;
      result.push({
        row: row,
        col: col,
        color: plan.color,
        connections: {
          top: hasConnection(row - 1, col, color),
          bottom: hasConnection(row + 1, col, color),
          left: hasConnection(row, col - 1, color),
          right: hasConnection(row, col + 1, color)
        }
      });
    }
  }

  return result;
}

export const getStack = createSelector(
  [
    (state: FieldState) => state.stack,
    (state: FieldState) => state.droppingPuyos
  ],
  _getStack
);

function _getStack(stack, droppings): StackForRendering {
  return getStackForRendering(stack, droppings);
}


export const hasDroppingPuyo = createSelector(
  [
    (state: FieldState) => state.stack
  ],
  (stack: Stack) => {
    for (let i = 0; i < fieldCols; i++) {
      for (let j = 1; j < fieldRows; j++) {
        if (stack[j - 1][i] !== 0 && stack[j][i] === 0) {
          return true;
        }
      }
    }
    return false;
  }
);
