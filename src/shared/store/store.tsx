import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

function getRavenMiddleware() {
  return createRavenMiddleware(Raven, {
    // stateTransformer: state => {
    //   return JSON.stringify(state, null, 2)
    // }
  });
}

function getLoggerMiddleware() {
  const stateTransformer = state => state;
  return createLogger({
    stateTransformer
  });
}

function getSagaMiddleware() {
  return createSagaMiddleware();
}

function getMiddleware(saga, raven, logger) {
  if (__DEV__) {
    return composeWithDevTools(applyMiddleware(saga/*, logger*/));
  }
  return applyMiddleware(saga, raven);
}

export function getStore(reducers, sagas) {
  const raven = getRavenMiddleware();
  const logger = getLoggerMiddleware();
  const saga = getSagaMiddleware();

  const store = createStore(reducers, getMiddleware(saga, raven, logger));

  saga.run(sagas);

  return store;
}