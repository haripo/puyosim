import { applyDropPlans, applyVanishPlans, createField, Stack } from "../models/stack";
import { State } from "./index";
import { fieldCols, fieldRows } from "../utils/constants";
import {
  APPLY_GRAVITY_EDITOR,
  FINISH_DROPPING_ANIMATIONS_EDITOR,
  FINISH_VANISHING_ANIMATIONS_EDITOR,
  INITIALIZE_EDITOR,
  PUT_CURRENT_ITEM,
  SELECT_EDIT_ITEM,
  VANISH_PUYOS_EDITOR
} from "../actions/actions";
import { DroppingPlan, getDropPlan, getVanishPlan, VanishingPlan } from "../models/chainPlanner";
import { calcChainStepScore } from "../models/score";

export type EditorState = {
  currentItem: number

  queue: number[][],
  stack: Stack,
  droppingPuyos: DroppingPlan[],
  vanishingPuyos: VanishingPlan[],
  isResetChainRequired: boolean,

  chain: number,
  chainScore: number,
  score: number,
}

function initializeEditor(state: EditorState, action, rootState: State) {
  state.stack = rootState.simulator.stack;
  state.queue = rootState.simulator.queue;
  return state;
}

function putCurrentItem(state: EditorState, action) {
  const { position } = action;
  state.stack[position.row][position.col] = state.currentItem;
  return state;
}

function selectEditItem(state: EditorState, action) {
  state.currentItem = action.item;
  return state;
}

// simulator.ts からのコピペ
function vanishPuyos(state: EditorState, action) {
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

// simulator.ts からのコピペ
function applyGravity(state: EditorState, action) {
  const plans = getDropPlan(state.stack, fieldRows, fieldCols);

  state.stack = applyDropPlans(state.stack, plans);
  state.droppingPuyos = plans;

  return state;
}

// simulator.ts からのコピペ
function finishDroppingAnimations(state: EditorState, action) {
  state.droppingPuyos = [];
  return state;
}

// simulator.ts からのコピペ
function finishVanishingAnimations(state: EditorState, action) {
  state.vanishingPuyos = [];
  return state;
}

export const initialState: EditorState = {
  currentItem: 0,

  queue: [],
  stack: createField(fieldRows, fieldCols),
  droppingPuyos: [],
  vanishingPuyos: [],
  isResetChainRequired: false,

  chain: 0,
  chainScore: 0,
  score: 0,
};

export const reducer = (state: EditorState, action, rootState: State) => {
  switch (action.type) {
    case INITIALIZE_EDITOR:
      return initializeEditor(state, action, rootState);
    case PUT_CURRENT_ITEM:
      return putCurrentItem(state, action);
    case SELECT_EDIT_ITEM:
      return selectEditItem(state, action);
    case VANISH_PUYOS_EDITOR:
      return vanishPuyos(state, action);
    case APPLY_GRAVITY_EDITOR:
      return applyGravity(state, action);
    case FINISH_DROPPING_ANIMATIONS_EDITOR:
      return finishDroppingAnimations(state, action);
    case FINISH_VANISHING_ANIMATIONS_EDITOR:
      return finishVanishingAnimations(state, action);
    default:
      return state;
  }
};
