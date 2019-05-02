import { State } from "./index";
import { INITIALIZE_EDITOR, PUT_CURRENT_ITEM, SELECT_EDIT_ITEM } from "../actions/actions";
import { createFieldReducer, FieldState, initialFieldState } from "./field";

export type EditorState = FieldState & {
  currentItem: number
}

function initializeEditor(state: EditorState, action, rootState: State) {
  state.stack = rootState.simulator.stack;
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

export const initialState: EditorState = {
  currentItem: 0,
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
    default:
      return state;
  }
};
