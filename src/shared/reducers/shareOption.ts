import { CHANGE_SHARE_OPTION } from "../actions/actions";

export type UrlShareType = 'none' | 'current';
export type MediaShareType = 'none' | 'image' | 'video';
export type ShareOption = {
  hasUrl: UrlShareType,
  hasMedia: MediaShareType
}

export type ShareOptionState = {
  shareOption: ShareOption
};

export const initialState: ShareOptionState = {
  shareOption: {
    hasUrl: 'current',
    hasMedia: 'video'
  }
};

function changeShareOption(state: ShareOptionState, action) {
  state.shareOption = action.shareOption;
  return state;
}

export const reducer = (state: ShareOptionState, action): ShareOptionState => {
  switch (action.type) {
    case CHANGE_SHARE_OPTION:
      return changeShareOption(state, action);
    default:
      return state;
  }
};