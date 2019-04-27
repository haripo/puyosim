import { createField, Stack } from "../models/stack";
import { State } from "./index";
import { fieldCols, fieldRows } from "../utils/constants";
import { PUT_CURRENT_ITEM, SELECT_EDIT_ITEM } from "../actions/actions";

export type EditorState = {
  currentItem: number

  queue: number[][],
  stack: Stack,
}

function copyFromSimulator(state: EditorState, action, rootState: State) {
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

export const initialState = {
  currentItem: 0,

  queue: [],
  stack: createField(fieldRows, fieldCols)
};

export const reducer = (state: EditorState, action, rootState: State) => {
  switch (action.type) {
    case 'INITIALIZE_EDITOR':
      return copyFromSimulator(state, action, rootState);
    case PUT_CURRENT_ITEM:
      return putCurrentItem(state, action);
    case SELECT_EDIT_ITEM:
      return selectEditItem(state, action);
    default:
      return state;
  }
};
