import { call, put, select, takeEvery } from "redux-saga/effects";
import { SHARE_CONFIRMED, shareMediaGenerationCompleted } from "../actions/actions";
import { MediaShareType, ShareOption } from "../reducers/shareOption";
import { getHistoryMovieUrl, getShareUrl, getStackImageUrl } from "../selectors/shareOptionSelectors";
import { State } from "../reducers";
import Share from "react-native-share";
import fs from 'react-native-fs';

type ShareParams = {
  url: string | null,
  message: string | null
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
      url: null,
      message: "#puyosim "
    };

    if (option.hasUrl === "current") {
      shareParam.message = yield select<(State) => string>(getShareUrl);
    }

    if (option.hasMedia !== 'none') {
      const url = yield select<(State) => string | null>(s => fetchMediaUrl(s, option.hasMedia));

      // 画像は base64 で受け渡ししてもシェアできるが，動画はファイルでないとうまくいかない
      // （Twitter は拡張子によってファイル形式が判別するらしく，base64 で共有すると動画と認識してくれない）
      const cacheFilePath = fs.CachesDirectoryPath + (option.hasMedia === 'video' ? '/cache.mp4' : '/cache.gif');
      const { promise } = fs.downloadFile({
        fromUrl: url,
        toFile: cacheFilePath,
      });

      // wait download completed
      yield call(() => promise);
      shareParam.url = 'file://' + cacheFilePath;
    }

    yield put(shareMediaGenerationCompleted());

    // なぜか setTimeout にしないと iOS でシェアできない
    const shareResponse = yield call(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Share.open(shareParam));
        }, 1);
      });
    });

    if (shareResponse['message'] !== 'OK') {
      console.warn(shareResponse);
    }

  } catch (e) {
    console.error(e);
  }
}

function* sagas() {
  yield takeEvery(SHARE_CONFIRMED, share);
}

export default sagas;
