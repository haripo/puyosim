import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  ARCHIVE_CURRENT_FIELD,
  DELETE_ARCHIVE,
  deleteArchiveFinished,
  EDIT_ARCHIVE,
  editArchiveFinished,
  LOAD_ARCHIVE_LIST_FIRST_PAGE,
  LOAD_ARCHIVE_LIST_NEXT_PAGE,
  loadArchiveListFirstPageFinished,
  loadArchiveListNextPageFinished, REQUEST_LOGIN, requestLoginSucceed
} from "../actions/actions";
import { getArchivedPlay } from "../selectors/simulatorSelectors";
import { deleteArchive, loadArchiveList, saveArchive } from "../utils/OnlineStorageService";
import { State } from "../reducers";
import firebase from "react-native-firebase";

function* getOrRequestLogin() {
  const currentUid = yield select<State>(state => state.auth.uid);

  if (currentUid !== null) {
    return yield currentUid;
  }

  return yield call(() => firebase.auth().signInAnonymously());
}

function* handleArchiveField(action) {
  const play = yield select<any>(state => getArchivedPlay(state.simulator, action.title));
  const user = yield getOrRequestLogin();
  yield call(saveArchive, play, user.uid);
}

function* handleLoadArchiveListFirstPage(action) {
  try {
    const user = yield getOrRequestLogin();
    const plays = yield call(loadArchiveList, null, 20, user.uid);
    yield put(loadArchiveListFirstPageFinished(plays));
  } catch (e) {
    console.error(e);
  }
}

function* handleLoadArchiveListNextPage(action) {
  const user = yield getOrRequestLogin();
  const ids = yield select<State>(state => state.archive.sortedIds);
  const lastItem = yield select<State>(state => state.archive.plays[ids[ids.length - 1]]);
  const plays = yield call(loadArchiveList, lastItem.updatedAt, action.count, user.uid);
  yield put(loadArchiveListNextPageFinished(plays));
}

function* handleEditArchivedPlay(action) {
  const user = yield getOrRequestLogin();
  const play = yield call(saveArchive, action.play, user.uid);
  yield put(editArchiveFinished(play));
}

function* handleDeleteArchivedPlay(action) {
  yield call(deleteArchive, action.id);
  yield put(deleteArchiveFinished(action.id));
}

function* handleRequestLogin(action) {
  try {
    const user = getOrRequestLogin();
    yield put(requestLoginSucceed(user));
  } catch (e) {
    console.error(e);
  }
}

function* sagas() {
  yield takeEvery(ARCHIVE_CURRENT_FIELD, handleArchiveField);
  yield takeEvery(LOAD_ARCHIVE_LIST_FIRST_PAGE, handleLoadArchiveListFirstPage);
  yield takeEvery(LOAD_ARCHIVE_LIST_NEXT_PAGE, handleLoadArchiveListNextPage);
  yield takeEvery(EDIT_ARCHIVE, handleEditArchivedPlay);
  yield takeEvery(DELETE_ARCHIVE, handleDeleteArchivedPlay);
  yield takeEvery(REQUEST_LOGIN, handleRequestLogin);
}

export default sagas;
