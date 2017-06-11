/**
 * Puyo simulator app
 * @flow
 */

import { mapValues } from 'lodash';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import Simulator from './src/containers/SimulatorContainer';
import reducer from './src/reducers';
import sagas from './src/sagas';
import { Navigation } from 'react-native-navigation';

const stateTransformer = (state) => {
  return mapValues(state, v => v.toJS());
};

const logger = createLogger({
  stateTransformer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware/*, logger*/));

sagaMiddleware.run(sagas);

export default class PuyoSimulator extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'Edit',
        id: 'edit',
        showAsAction: 'never'
      }
    ]
  };

  render() {
    return (
      <Provider store={ store }>
        <Simulator>
        </Simulator>
      </Provider>
    );
  }
};

Navigation.registerComponent('com.puyosimulator.Simulator', () => PuyoSimulator);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'com.puyosimulator.Simulator',
    title: 'puyosim',
  },
  animationType: 'slide-down'
});
