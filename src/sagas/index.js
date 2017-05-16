/* @flow */

import { put, select, takeLatest } from 'redux-saga/effects';
import { getConnectedPuyos } from '../reducers/simulator';

function* doDroppingPhase() {
  yield put({
    type: 'APPLY_GRAVITY'
  });
}

function* doVanishingPhase() {
  const targets = yield select(getConnectedPuyos);

  // chain is finished
  if (targets.length > 0) {
    yield put({
      type: 'VANISH_PUYOS',
      payload: {
        targets
      }
    });
  } else {
    yield put({ type: 'CHAIN_FINISHED' });
  }
}

function* sagas() {
  yield takeLatest('CHAIN_VANISHING_PHASE', doVanishingPhase);
  yield takeLatest('CHAIN_DROPPING_PHASE', doDroppingPhase);
}

export default sagas;