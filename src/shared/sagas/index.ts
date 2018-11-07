import { select, take } from "redux-saga/effects";
import { ARCHIVE_CURRENT_FIELD } from "../actions/actions";
import { archiveCurrentPlay } from "../utils/StorageService.native";
import { getArchivedPlay } from "../selectors/simulatorSelectors";

function* handleArchiveField() {
  while (true) {
    yield take(ARCHIVE_CURRENT_FIELD);
    const play = yield select<any>(state => getArchivedPlay(state.simulator));
    archiveCurrentPlay(play); // selector で archiveItem をもってくる
  }
}

function* sagas() {
  yield handleArchiveField();
}

export default sagas;
