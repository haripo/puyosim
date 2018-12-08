import { put, select, take, takeEvery } from "redux-saga/effects";
import {
  ARCHIVE_CURRENT_FIELD,
  DELETE_ARCHIVE,
  DELETE_ARCHIVE_FINISHED, EDIT_ARCHIVE, EDIT_ARCHIVE_FINISHED, editArchiveFinished,
  LOAD_ARCHIVE,
  LOAD_ARCHIVE_FINISHED
} from "../actions/actions";
import {
  archiveCurrentPlay,
  deleteArchivedPlay,
  editArchivedPlay,
  loadArchivedPlay
} from "../utils/StorageService.native";
import { getArchivedPlay } from "../selectors/simulatorSelectors";

function* handleArchiveField(action) {
  const play = yield select<any>(state => getArchivedPlay(state.simulator, action.title));
  // いつか非同期にしたい
  archiveCurrentPlay(play);
}

function* handleLoadArchivedPlay(action) {
  const play = loadArchivedPlay(action.id);
  yield put({ type: LOAD_ARCHIVE_FINISHED, play })
}

function* handleEditArchivedPlay(action) {
  const play = editArchivedPlay(action.id, action.title);
  yield put(editArchiveFinished(play));
}

function* handleDeleteArchivedPlay(action) {
  deleteArchivedPlay(action.id);
  yield put({ type: DELETE_ARCHIVE_FINISHED, id: action.id })
}

function* sagas() {
  yield takeEvery(ARCHIVE_CURRENT_FIELD, handleArchiveField);
  yield takeEvery(LOAD_ARCHIVE, handleLoadArchivedPlay);
  yield takeEvery(EDIT_ARCHIVE, handleEditArchivedPlay);
  yield takeEvery(DELETE_ARCHIVE, handleDeleteArchivedPlay);
}

export default sagas;
