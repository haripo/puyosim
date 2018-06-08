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
import { Navigation } from 'react-native-navigation';
import { composeWithDevTools } from 'redux-devtools-extension';

import Simulator from './src/native/screens/SimulatorContainer';
import History from './src/native/screens/HistoryContainer';
import About from './src/native/screens/AboutContainer';
import Settings from './src/native/screens/SettingsContainer';
import reducer from './src/shared/reducers';
import sagas from './src/shared/sagas';

import { Client } from 'bugsnag-react-native';

import { Sentry } from 'react-native-sentry';
import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

Sentry.config('https://d03216589dad4ea9ac7a2431b901ff11:772e66c1594b42969f68d524e683a3b1@sentry.io/1222354').install();

ravenMiddleware = createRavenMiddleware(Raven, {
  // stateTransformer: state => {
  //   return JSON.stringify(state, null, 2)
  // }
});

Client.releaseStage = 'development';
Client.notifyReleaseStages = ['production'];

const stateTransformer = state => state.toJS();

const logger = createLogger({
  stateTransformer
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware, ravenMiddleware/*, logger*/)));

sagaMiddleware.run(sagas);

// Register screen components
Navigation.registerComponent('com.puyosimulator.Simulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.History', () => History, store, Provider);
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
