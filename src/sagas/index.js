
import { put, select, takeLatest } from 'redux-saga/effects';
import { canVanish } from '../reducers/simulator';
import {
  applyGravity,
  vanishPuyos,
  chainFinished,
  DO_CHAIN_DROPPING_PHASE,
  DO_CHAIN_VANISHING_PHASE
} from '../actions/actions';

function* doDroppingPhase() {
  yield put(applyGravity());
}

function* doVanishingPhase() {
  const isChainProceed = yield select(canVanish);

  if (isChainProceed) {
    yield put(vanishPuyos());
  } else {
    yield put(chainFinished());
  }
}

function* sagas() {
  yield takeLatest(DO_CHAIN_VANISHING_PHASE, doVanishingPhase);
  yield takeLatest(DO_CHAIN_DROPPING_PHASE, doDroppingPhase);
}

export default sagas;