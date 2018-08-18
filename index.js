// https://github.com/facebook/react-native/issues/18175#issuecomment-370575211
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Warning: isMounted(...) is deprecated'
]);


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

import { Sentry } from 'react-native-sentry';

if (!__DEV__) {
  Sentry
    .config('https://***REMOVED***')
    .install();
}

const store = getStore(reducers, sagas);

// Register screen components
Navigation.registerComponent('com.puyosimulator.Simulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.History', () => History, store, Provider);
Navigation.registerComponent('com.puyosimulator.About', () => About, store, Provider);
Navigation.registerComponent('com.puyosimulator.Settings', () => Settings, store, Provider);

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