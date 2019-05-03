import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

// @ts-ignore
import snackbarMiddleware from "../middlewares/snackbarMiddleware";

function getRavenMiddleware() {
  return createRavenMiddleware(Raven, {
    // stateTransformer: state => {
    //   return JSON.stringify(state, null, 2)
    // }
  });
}

function getLoggerMiddleware() {
  const stateTransformer = state => ""; // state のログが多すぎるので消す
  return createLogger({
    // stateTransformer
  });
}

function getSagaMiddleware() {
  return createSagaMiddleware();
}

export function getStore(reducers, sagas) {
  const raven = getRavenMiddleware();
  const logger = getLoggerMiddleware();
  const saga = getSagaMiddleware();

  let middleware;
  if (__DEV__) {
    middleware = composeWithDevTools(applyMiddleware(saga, logger, snackbarMiddleware));
  } else {
    middleware = applyMiddleware(saga, raven, snackbarMiddleware);
  }

  const store = createStore(reducers, middleware);

  saga.run(sagas);

  return store;
}