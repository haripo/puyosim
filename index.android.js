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

import Simulator from './src/screens/SimulatorContainer';
import About from './src/screens/AboutContainer';
import Settings from './src/screens/SettingsContainer';
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

// Register screen components
Navigation.registerComponent('com.puyosimulator.Simulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.About', () => About, store, Provider);
Navigation.registerComponent('com.puyosimulator.Settings', () => Settings, store, Provider);

// launch first screen
Navigation.startSingleScreenApp({
  screen: {
    screen: 'com.puyosimulator.Simulator',
  },
  appStyle: {
    orientation: 'portrait'
  },
  animationType: 'none',
  portraitOnlyMode: true,
});
