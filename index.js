import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import Simulator from './src/native/screens/SimulatorContainer';
import History from './src/native/screens/HistoryContainer';
import About from './src/native/screens/AboutContainer';
import Settings from './src/native/screens/SettingsContainer';
import { getStore } from './src/shared/store/store';

import sagas from './src/shared/sagas';
import reducers from './src/shared/reducers'

import { Client } from 'bugsnag-react-native';
import { Sentry } from 'react-native-sentry';

global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

Client.releaseStage = 'development';
Client.notifyReleaseStages = ['production'];

Sentry.config('https://***REMOVED***').install();

const store = getStore(reducers, sagas);

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
