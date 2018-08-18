import { RESET_LAYOUT } from '../actions/actions';

export type LayoutState = {
  width: number,
  height: number,
}

function resetLayout(state: LayoutState, action) {
  state.width = action.layout.width;
  state.height = action.layout.height;
  return state;
}

export const initialState = {
  width: 0,
  height: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case RESET_LAYOUT:
      return resetLayout(state, action);
    default:
      return state;
  }
};
