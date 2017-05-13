/* @flow */

import { put, select, takeLatest } from 'redux-saga/effects';
import { getConnectedPuyos } from '../reducers/simulator';

function* doDroppingPhase(action) {

  yield put({
    type: 'APPLY_GRAVITY'
  });
}

function* doVanishingPhase(action) {
  console.log('van');
  const targets = yield select(getConnectedPuyos);

  // chain is finished
  if (targets.length > 0) {
    yield put({
      type: 'VANISH_PUYOS',
      payload: {
        targets
      }
    });
    yield put({
      type: 'CHAIN_DROPPING_PHASE'
    });
  } else {
    yield put({ type: 'CHAIN_FINISHED' });
  }
}

function* sagas() {
  yield takeLatest('PUT_NEXT_PAIR', doVanishingPhase);
  yield takeLatest('CHAIN_VANISHING_PHASE', doVanishingPhase);
  yield takeLatest('CHAIN_DROPPING_PHASE', doDroppingPhase);
}

export default sagas;