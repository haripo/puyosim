/* @flow */

import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getConnectedPuyos } from '../reducers/simulator';

function* vanish(action) {
  while(true) {
    const targets = yield select(getConnectedPuyos);
    console.log(targets);

    // chain is finished
    if (targets.length === 0) break;

    yield put({
      type: "VANISH_PUYOS",
      payload: {
        targets
      }
    });
    yield delay(500);
    yield put({
      type: 'APPLY_GRAVITY'
    });
    yield delay(500);
  }

  yield put({ type: "CHAIN_FINISHED" });
}

function* sagas() {
  yield takeLatest("PUT_NEXT_PAIR", vanish);
}

export default sagas;