import { call, put, select, takeEvery, fork } from "redux-saga/effects";
import {
  ARCHIVE_CURRENT_FIELD,
  archiveCurrentFieldFinished,
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
  RESTART,
  showSnackbar
} from "../actions/actions";
import configSagas from './config';
import shareSagas from './share';

// @ts-ignore
import { Archive, deleteArchive, loadArchiveList, saveArchive } from "../utils/OnlineStorageService";
// @ts-ignore
import { reloadAd } from "../models/admob";
// @ts-ignore
import { t } from "../../shared/utils/i18n";

// @ts-ignore
import { captureException } from "../utils/Sentry";

// @ts-ignore
import { requestLogin } from "../utils/OnlineStorageService";

function* getOrRequestLogin() {
  const currentUid = yield select<(State) => string>(state => state.uid);

  if (currentUid) {
    return yield currentUid;
  }

  // @ts-ignore
  const credential = yield call(requestLogin);
  return yield credential.user.uid;
}

function* handleArchiveField(action) {
  try {
    const uid = yield getOrRequestLogin();
    const archive = yield call(saveArchive, action.archivePayload, uid);
    yield put(showSnackbar(t('saveSucceeded')));
    yield put(archiveCurrentFieldFinished(archive));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('saveFailed')));
  }
}

function* handleLoadArchiveListFirstPage(action) {
  try {
    const uid = yield call(getOrRequestLogin);
    const archives = yield call(loadArchiveList, null, 20, uid);
    yield put(loadArchiveListFirstPageFinished(archives));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('loadFailed')));
  }
}

function* handleLoadArchiveListNextPage(action) {
  try {
    const uid = yield call(getOrRequestLogin);
    const ids = yield select<(State) => string[]>(state => state.archive.sortedIds);
    const lastItem = yield select<(State) => Archive>(state => state.archive.archives[ids[ids.length - 1]]);
    const archives = yield call(loadArchiveList, lastItem.play.updatedAt.toDate(), action.count, uid);
    yield put(loadArchiveListNextPageFinished(archives));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('loadFailed')));
  }
}

function* handleEditArchivedPlay(action) {
  try {
    const uid = yield call(getOrRequestLogin);
    const play = yield call(saveArchive, action.archivePayload, uid);
    yield put(editArchiveFinished(play));
    yield put(showSnackbar(t('saveSucceeded')));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('editFailed')));
  }
}

function* handleDeleteArchivedPlay(action) {
  try {
    yield call(deleteArchive, action.id);
    yield put(deleteArchiveFinished(action.id));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('deleteFailed')));
  }
}

function* handleRequestLogin(action) {
  try {
    const user = getOrRequestLogin();
    yield put(requestLoginSucceed(user));
  } catch (e) {
    console.error(e);
    captureException(e);
    yield put(showSnackbar(t('authFailed')));
  }
}

function* handleRestart(action) {
  // @ts-ignore
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
  yield fork(configSagas);
  yield fork(shareSagas);
}

export default sagas;
