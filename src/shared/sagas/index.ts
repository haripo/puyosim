import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  ARCHIVE_CURRENT_FIELD, archiveCurrentFieldFinished,
  DELETE_ARCHIVE,
  deleteArchiveFinished,
  EDIT_ARCHIVE,
  editArchiveFinished,
  LOAD_ARCHIVE_LIST_FIRST_PAGE,
  LOAD_ARCHIVE_LIST_NEXT_PAGE,
  loadArchiveListFirstPageFinished,
  loadArchiveListNextPageFinished,
  REQUEST_LOGIN,
  requestLoginSucceed,
  RESTART
} from "../actions/actions";
import { getArchivedPlay } from "../selectors/simulatorSelectors";
import { deleteArchive, loadArchiveList, saveArchive } from "../utils/OnlineStorageService";
import firebase from "react-native-firebase";
import { reloadAd } from "../models/admob";
import { ArchivedPlay } from "../utils/StorageService.native";

function* getOrRequestLogin() {
  const currentUid = yield select<(State) => string>(state => state.uid);

  if (currentUid) {
    return yield currentUid;
  }

  const credential = yield call(() => firebase.auth().signInAnonymously());
  return yield credential.user.uid;
}

function* handleArchiveField(action) {
  const play = yield select<any>(state => getArchivedPlay(state.simulator, action.title));
  const uid = yield getOrRequestLogin();
  yield call(saveArchive, play, uid);
  yield put(archiveCurrentFieldFinished());
}

function* handleLoadArchiveListFirstPage(action) {
  try {
    const uid = yield call(getOrRequestLogin);
    const plays = yield call(loadArchiveList, null, 20, uid);
    yield put(loadArchiveListFirstPageFinished(plays));
  } catch (e) {
    console.error(e);
  }
}

function* handleLoadArchiveListNextPage(action) {
  const uid = yield call(getOrRequestLogin);
  const ids = yield select<(State) => string[]>(state => state.archive.sortedIds);
  const lastItem = yield select<(State) => { [id: string]: ArchivedPlay }>(state => state.archive.plays[ids[ids.length - 1]]);
  const plays = yield call(loadArchiveList, lastItem.updatedAt, action.count, uid);
  yield put(loadArchiveListNextPageFinished(plays));
}

function* handleEditArchivedPlay(action) {
  const uid = yield call(getOrRequestLogin);
  const play = yield call(saveArchive, action.play, uid);
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

function *handleRestart(action) {
  reloadAd.show();
}

function* sagas() {
  yield takeEvery(ARCHIVE_CURRENT_FIELD, handleArchiveField);
  yield takeEvery(LOAD_ARCHIVE_LIST_FIRST_PAGE, handleLoadArchiveListFirstPage);
  yield takeEvery(LOAD_ARCHIVE_LIST_NEXT_PAGE, handleLoadArchiveListNextPage);
  yield takeEvery(EDIT_ARCHIVE, handleEditArchivedPlay);
  yield takeEvery(DELETE_ARCHIVE, handleDeleteArchivedPlay);
  yield takeEvery(REQUEST_LOGIN, handleRequestLogin);
  yield takeEvery(RESTART, handleRestart);
}

export default sagas;
