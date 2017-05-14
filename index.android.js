/**
 * Puyo simulator app
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger'

import Simulator from './src/containers/SimulatorContainer';
import reducer from './src/reducers';
import sagas from './src/sagas';
import { mapValues } from 'lodash';


const stateTransformer = (state) => {
  return mapValues(state, v => v.toJS());
};

const logger = createLogger({
  stateTransformer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(sagas);

export default class PuyoSimulator extends Component {
  render() {
    return (
      <Provider store={store}>
        <Simulator>
        </Simulator>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('PuyoSimulator', () => PuyoSimulator);
