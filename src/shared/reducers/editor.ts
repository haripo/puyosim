import { State } from "./index";
import {
  INITIALIZE_EDITOR,
  PUT_CURRENT_ITEM,
  RESET_EDITOR_FIELD,
  SELECT_EDIT_ITEM,
  UNDO_EDITOR_FIELD
} from "../actions/actions";
import { createFieldReducer, FieldState, initialFieldState } from "./field";
import { Stack } from "../models/stack";

export type EditorState = FieldState & {
  currentItem: number,

  history: { stack: Stack }[],
  historyIndex: number
}

function initializeEditor(state: EditorState, action, rootState: State) {
  state.stack = rootState.simulator.stack;
  state.history = [
    {
      stack: state.stack
    }
  ];
  state.historyIndex = 0;
  return state;
}

function putCurrentItem(state: EditorState, action) {
  const { position } = action;
  state.stack[position.row][position.col] = state.currentItem;

  // update history
  state.historyIndex += 1;
  state.history[state.historyIndex] = {
    stack: state.stack
  };

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
  state.stack = state.history[state.historyIndex].stack;
  return state;
}

function resetEditorField(state: EditorState): EditorState {
  state.historyIndex = 0;
  state.stack = state.history[state.historyIndex].stack;
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
