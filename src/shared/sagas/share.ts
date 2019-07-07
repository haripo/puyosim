import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  SHARE_CONFIRMED,
  shareMediaGenerationCompleted,
  shareMediaGenerationFailed,
  showSnackbar
} from "../actions/actions";
import { MediaShareType, ShareOption } from "../reducers/shareOption";
import { getHistoryMovieUrl, getWholePathShareUrl, getStackImageUrl } from "../selectors/shareOptionSelectors";
import { State } from "../reducers";
import { captureException } from "../platformServices/sentry";
import { t } from "../platformServices/i18n";
import { fetchRemoteMedia, openShare } from "../platformServices/share";

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
    let url: string | null = null;
    let message: string | null = null;

    if (option.hasUrl === "current") {
      message = yield select<(State) => string>(getWholePathShareUrl);
    }

    if (option.hasMedia !== 'none') {
      try {
        const remoteUrl = yield select<(State) => string | null>(s => fetchMediaUrl(s, option.hasMedia));
        const extension = option.hasMedia === 'video' ? 'mp4' : 'gif';
        const cacheFilePath = yield call(() => fetchRemoteMedia(remoteUrl, extension));
        url = 'file://' + cacheFilePath;
      } catch (e) {
        yield put(showSnackbar(t('shareFailed')));
        console.error(e);
        captureException(e);
        yield put(shareMediaGenerationFailed());
        return;
      }
    }

    yield put(shareMediaGenerationCompleted());

    const shareResponse = yield call(() => openShare(url, message));
    if (shareResponse['message'] !== 'OK') {
      console.warn(shareResponse);
    }

  } catch (e) {
    captureException(e);
    console.error(e);
  }
}

function* sagas() {
  yield takeEvery(SHARE_CONFIRMED, share);
}

export default sagas;
