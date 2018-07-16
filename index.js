import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
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

Sentry.config('https://d03216589dad4ea9ac7a2431b901ff11:772e66c1594b42969f68d524e683a3b1@sentry.io/1222354').install();

const store = getStore(reducers, sagas);

// Register screen components
//Navigation.registerComponent('PuyoSimulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.Simulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.History', () => History, store, Provider);
Navigation.registerComponent('com.puyosimulator.About', () => About, store, Provider);
Navigation.registerComponent('com.puyosimulator.Settings', () => Settings, store, Provider);

// launch first screen
// const App = () => {
//   return Navigation.startSingleScreenApp({
//     screen: {
//       screen: 'com.puyosimulator.Simulator',
//     },
//     appStyle: {
//       orientation: 'portrait'
//     },
//     animationType: 'none',
//     portraitOnlyMode: true,
//   });
// };

export default class App extends Component {
  constructor(props) {
    super(props);
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
  }

  render() {
    return (
      <Text>
        hogehgoe
      </Text>
    );
  }
}
const app = new App();
// Navigation.startSingleScreenApp({
//   screen: {
//     screen: 'com.puyosimulator.Simulator',
//   },
//   appStyle: {
//     orientation: 'portrait'
//   },
//   animationType: 'none',
//   portraitOnlyMode: true,
// });

// AppRegistry.registerComponent('PuyoSimulator', () => App);
//