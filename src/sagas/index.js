/* @flow */

import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getConnectedPuyos, getDroppingPuyos } from '../reducers/simulator';

function* vanish(action) {
  while(true) {
    const targets = yield select(getConnectedPuyos);

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

    let droppings = yield select(getDroppingPuyos);
    while (droppings.count() > 0) {
      yield put({
        type: 'DROP_ANIMATION_PROCEED'
      });
      yield delay(50); // 20fps
      droppings = yield select(getDroppingPuyos);
    }
  }

  yield put({ type: "CHAIN_FINISHED" });
}

function* sagas() {
  yield takeLatest("PUT_NEXT_PAIR", vanish);
}

export default sagas;