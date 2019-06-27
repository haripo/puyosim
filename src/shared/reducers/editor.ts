import { State } from "./index";
import {
  INITIALIZE_EDITOR,
  PUT_CURRENT_ITEM,
  RESET_EDITOR_FIELD,
  SELECT_EDIT_ITEM,
  UNDO_EDITOR_FIELD
} from "../actions/actions";
import { createFieldReducer, FieldState, initialFieldState } from "./field";
import { Stack } from "../../types";

export type EditorState = FieldState & {
  currentItem: number,

  history: {
    stack: Stack,
    chain: number,
    score: number,
    chainScore: number
  }[],
  historyIndex: number
}

function initializeEditor(state: EditorState, action, rootState: State) {
  state.stack = rootState.simulator.stack;

  state.history = [
    {
      stack: state.stack,
      chain: 0,
      score: 0,
      chainScore: 0
    }
  ];
  state.historyIndex = 0;

  state.chain = 0;
  state.score = 0;
  state.chainScore = 0;
  return state;
}

function putCurrentItem(state: EditorState, action) {
  const { position } = action;
  state.stack[position.row][position.col] = state.currentItem;

  // update history
  state.historyIndex += 1;
  state.history[state.historyIndex] = {
    stack: state.stack,
    chain: state.chain,
    score: state.score,
    chainScore: state.chainScore
  };

  state.isResetChainRequired = true;

  return state;
}

function selectEditItem(state: EditorState, action) {
  state.currentItem = action.item;
  return state;
}

function undoEditorField(state: EditorState): EditorState {
  if (state.historyIndex === 0) {
    return state;
  }

  state.historyIndex -= 1;

  const record = state.history[state.historyIndex];
  state.stack = record.stack;
  state.chainScore = record.chainScore;
  state.score = record.score;
  state.chain = record.chain;

  return state;
}

function resetEditorField(state: EditorState): EditorState {
  state.historyIndex = 0;

  const record = state.history[state.historyIndex];
  state.stack = record.stack;
  state.chainScore = record.chainScore;
  state.score = record.score;
  state.chain = record.chain;

  return state;
}

export const initialState: EditorState = {
  currentItem: 0,
  history: [],
  historyIndex: 0,
  ...initialFieldState
};

const fieldReducer = createFieldReducer('editor');

export const reducer = (state: EditorState, action, rootState: State) => {
  state = {
    ...state,
    ...fieldReducer(state, action)
  };

  switch (action.type) {
    case INITIALIZE_EDITOR:
      return initializeEditor(state, action, rootState);
    case PUT_CURRENT_ITEM:
      return putCurrentItem(state, action);
    case SELECT_EDIT_ITEM:
      return selectEditItem(state, action);
    case UNDO_EDITOR_FIELD:
      return undoEditorField(state);
    case RESET_EDITOR_FIELD:
      return resetEditorField(state);
    default:
      return state;
  }
};
