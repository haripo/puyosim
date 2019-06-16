import { call, put, select, takeEvery } from "redux-saga/effects";
import { saveConfigCompleted, SHARE_CONFIRMED } from "../actions/actions";
import { MediaShareType, ShareOption } from "../reducers/shareOption";
import { getHistoryMovieUrl, getShareUrl, getStackImageUrl } from "../selectors/shareOptionSelectors";
import { State } from "../reducers";
import Share from "react-native-share";

type ShareParams = {
  url: string,
  message: string
};

function fetchMediaUrl(state: State, mediaType: MediaShareType) {
  switch (mediaType) {
    case 'image':
      return getStackImageUrl(state);
    case "video":
      return getHistoryMovieUrl(state);
  }
  return null;
}

function* share() {
  try {
    const option: ShareOption = yield select<(State) => ShareOption>(state => state.shareOption.shareOption);

    let shareParam: ShareParams = {
      url: '',
      message: ''
    };

    if (option.hasUrl === "current") {
      shareParam.message += yield select<(State) => string>(getShareUrl);
    }

    const url = yield select<(State) => string | null>(s => fetchMediaUrl(s, option.hasMedia));
    if (url !== null) {
      const response = yield call(() => fetch(url));
      const data = yield call(() => response.text());
      shareParam.url = 'data:image/gif;base64,' + data;
    }

    const shareResponse = yield call(() => Share.open(shareParam));
    if (shareResponse['message'] !== 'OK') {
      console.warn(shareResponse);
    }

    //yield put(saveConfigCompleted(configState));
  } catch (e) {
    console.error(e);
  }
}

function* sagas() {
  yield takeEvery(SHARE_CONFIRMED, share);
}

export default sagas;
