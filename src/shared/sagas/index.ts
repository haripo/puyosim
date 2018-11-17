import { put, select, take, takeEvery } from "redux-saga/effects";
import { ARCHIVE_CURRENT_FIELD, LOAD_ARCHIVE, LOAD_ARCHIVE_FINISHED } from "../actions/actions";
import { archiveCurrentPlay, loadArchivedPlay } from "../utils/StorageService.native";
import { getArchivedPlay } from "../selectors/simulatorSelectors";

function* handleArchiveField() {
  const play = yield select<any>(state => getArchivedPlay(state.simulator));
  archiveCurrentPlay(play);
}

function* handleLoadArchivedPlay(action) {
  const play = loadArchivedPlay(action.id);
  yield put({ type: LOAD_ARCHIVE_FINISHED, play })
}

function* sagas() {
  yield takeEvery(ARCHIVE_CURRENT_FIELD, handleArchiveField);
  yield takeEvery(LOAD_ARCHIVE, handleLoadArchivedPlay);
}

export default sagas;
