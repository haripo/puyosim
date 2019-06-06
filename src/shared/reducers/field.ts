import { applyDropPlans, applyVanishPlans, createField } from "../models/stack";
import { fieldCols, fieldRows } from "../utils/constants";
import {
  APPLY_GRAVITY,
  FINISH_DROPPING_ANIMATIONS,
  FINISH_VANISHING_ANIMATIONS, RUN_CHAIN_ANIMATION,
  VANISH_PUYOS
} from "../actions/actions";
import { DroppingPlan, getDropPlan, getVanishPlan, VanishingPlan } from "../models/chainPlanner";
import { calcChainStepScore } from "../models/score";
import { hasDroppingPuyo } from "../selectors/fieldSelectors";
import { Stack } from "../../types";

export type FieldState = {
  stack: Stack,

  // animations
  droppingPuyos: DroppingPlan[],
  vanishingPuyos: VanishingPlan[],
  isResetChainRequired: boolean,

  // scores
  chain: number,
  chainScore: number,
  score: number,
}

/**
 * Launch chain animation process
 */
function runChainAnimation(state: FieldState, action) {
  // エディットによって 4 連結のぷよが浮いている状態にしたとき、
  // アニメーションが落下を先に処理するか消去を先に処理するかがここで決定されている
  if (hasDroppingPuyo(state)) {
    return applyGravity(state, {});
  }
  return vanishPuyos(state, {});
}

function vanishPuyos(state: FieldState, action) {
  const plans = getVanishPlan(state.stack, fieldRows, fieldCols);

  if (plans.length === 0) {
    return state;
  }

  if (state.isResetChainRequired) {
    state.isResetChainRequired = false;
    state.chain = 0;
    state.chainScore = 0;
  }

  state.stack = applyVanishPlans(state.stack, plans);
  state.vanishingPuyos = plans;

  state.chain += 1;

  // update scores
  const additionalScore = calcChainStepScore(state.chain, plans);
  state.score += additionalScore;
  state.chainScore += additionalScore;

  return state;
}

function applyGravity(state: FieldState, action) {
  const plans = getDropPlan(state.stack, fieldRows, fieldCols);

  state.stack = applyDropPlans(state.stack, plans);
  state.droppingPuyos = plans;

  return state;
}

function finishDroppingAnimations(state: FieldState, action) {
  state.droppingPuyos = [];
  return state;
}

function finishVanishingAnimations(state: FieldState, action) {
  state.vanishingPuyos = [];
  return state;
}

export const initialFieldState: FieldState = {
  stack: createField(fieldRows, fieldCols),
  droppingPuyos: [],
  vanishingPuyos: [],
  isResetChainRequired: false,

  chain: 0,
  chainScore: 0,
  score: 0,
};

export const createFieldReducer = (fieldType: string) => {
  return (state: FieldState, action) => {
    if (action.fieldType !== fieldType) {
      return state;
    }

    switch (action.type) {
      case RUN_CHAIN_ANIMATION:
        return runChainAnimation(state, action);
      case VANISH_PUYOS:
        return vanishPuyos(state, action);
      case APPLY_GRAVITY:
        return applyGravity(state, action);
      case FINISH_DROPPING_ANIMATIONS:
        return finishDroppingAnimations(state, action);
      case FINISH_VANISHING_ANIMATIONS:
        return finishVanishingAnimations(state, action);
      default:
        return state;
    }
  };
}
