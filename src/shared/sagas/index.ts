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
  loadArchiveListNextPageFinished
} from "../actions/actions";
import { getArchivedPlay } from "../selectors/simulatorSelectors";
import { deleteArchive, loadArchiveList, saveArchive } from "../utils/OnlineStorageService";
import { State } from "../reducers";

function* handleArchiveField(action) {
  const play = yield select<any>(state => getArchivedPlay(state.simulator, action.title));
  yield call(saveArchive, play);
}

function* handleLoadArchiveListFirstPage(action) {
  const plays = yield call(loadArchiveList, null, 5);
  yield put(loadArchiveListFirstPageFinished(plays));
}

function* handleLoadArchiveListNextPage(action) {
  const ids = yield select<State>(state => state.archive.sortedIds);
  const lastItem = yield select<State>(state => state.archive.plays[ids[ids.length - 1]]);
  const plays = yield call(loadArchiveList, lastItem.updatedAt, action.count);
  yield put(loadArchiveListNextPageFinished(plays));
}

function* handleEditArchivedPlay(action) {
  const play = yield call(saveArchive, action.play);
  yield put(editArchiveFinished(play));
}

function* handleDeleteArchivedPlay(action) {
  yield call(deleteArchive, action.id);
  yield put(deleteArchiveFinished(action.id));
}

function* sagas() {
  yield takeEvery(ARCHIVE_CURRENT_FIELD, handleArchiveField);
  yield takeEvery(LOAD_ARCHIVE_LIST_FIRST_PAGE, handleLoadArchiveListFirstPage);
  yield takeEvery(LOAD_ARCHIVE_LIST_NEXT_PAGE, handleLoadArchiveListNextPage);
  yield takeEvery(EDIT_ARCHIVE, handleEditArchivedPlay);
  yield takeEvery(DELETE_ARCHIVE, handleDeleteArchivedPlay);
}

export default sagas;
