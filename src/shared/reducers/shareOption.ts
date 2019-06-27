import {
  CHANGE_SHARE_OPTION,
  SHARE_CONFIRMED,
  SHARE_MEDIA_GENERATION_COMPLETED,
  SHARE_MEDIA_GENERATION_FAILED
} from "../actions/actions";

export type UrlShareType = 'none' | 'current';
export type MediaShareType = 'none' | 'image' | 'video';
export type ShareOption = {
  hasUrl: UrlShareType,
  hasMedia: MediaShareType
}

export type ShareOptionState = {
  shareOption: ShareOption,
  isGenerating: boolean
};

export const initialState: ShareOptionState = {
  shareOption: {
    hasUrl: 'current',
    hasMedia: 'video'
  },
  isGenerating: false
};

function changeShareOption(state: ShareOptionState, action) {
  state.shareOption = action.shareOption;
  return state;
}

function shareConfirmed(state: ShareOptionState) {
  state.isGenerating = true;
  return state;
}

function shareMediaGenerationCompleted(state: ShareOptionState) {
  state.isGenerating = false;
  return state;
}

function shareMediaGenerationFailed(state: ShareOptionState) {
  state.isGenerating = false;
  return state;
}

export const reducer = (state: ShareOptionState, action): ShareOptionState => {
  switch (action.type) {
    case CHANGE_SHARE_OPTION:
      return changeShareOption(state, action);
    case SHARE_CONFIRMED:
      return shareConfirmed(state);
    case SHARE_MEDIA_GENERATION_COMPLETED:
      return shareMediaGenerationCompleted(state);
    case SHARE_MEDIA_GENERATION_FAILED:
      return shareMediaGenerationFailed(state);
    default:
      return state;
  }
};