/* @flow */

import { put, select, takeLatest } from 'redux-saga/effects';
import { canVanish } from '../reducers/simulator';

function* doDroppingPhase() {
  yield put({
    type: 'APPLY_GRAVITY'
  });
}

function* doVanishingPhase() {
  const isChainProceed = yield select(canVanish);

  // chain is finished
  if (isChainProceed) {
    yield put({
      type: 'VANISH_PUYOS',
    });
  } else {
    yield put({
      type: 'CHAIN_FINISHED'
    });
  }
}

function* sagas() {
  yield takeLatest('CHAIN_VANISHING_PHASE', doVanishingPhase);
  yield takeLatest('CHAIN_DROPPING_PHASE', doDroppingPhase);
}

export default sagas;