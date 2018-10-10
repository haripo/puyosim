// https://github.com/facebook/react-native/issues/18175#issuecomment-370575211
import { YellowBox, Platform } from 'react-native';

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
import Share from './src/native/screens/ShareOptionContainer';
import Viewer from './src/native/screens/ViewerContainer';
import { getStore } from './src/shared/store/store';

import sagas from './src/shared/sagas';
import reducers from './src/shared/reducers'

import { SENTRY_DSN } from 'react-native-dotenv'

import { Sentry } from 'react-native-sentry';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from "react-native-firebase";

if (!__DEV__ && SENTRY_DSN) {
  Sentry
    .config(SENTRY_DSN)
    .install();
}

const store = getStore(reducers, sagas);

// Register screen components
Navigation.registerComponent('com.puyosimulator.Simulator', () => Simulator, store, Provider);
Navigation.registerComponent('com.puyosimulator.History', () => History, store, Provider);
Navigation.registerComponent('com.puyosimulator.About', () => About, store, Provider);
Navigation.registerComponent('com.puyosimulator.Settings', () => Settings, store, Provider);
Navigation.registerComponent('com.puyosimulator.Share', () => Share, store, Provider);
Navigation.registerComponent('com.puyosimulator.Viewer', () => Viewer, store, Provider);

async function launch() {
  // const url = await firebase.links().getInitialLink();
  // if (url) {
  //   const query = parse(url.split('?')[1]);
  //   if ('q' in query && 'h' in query) {
  //     this.props.onReconstructHistoryRequested(
  //       query['h'],
  //       query['q'],
  //       'i' in query ? parseInt(query['i']) : 0,
  //     )
  //   }
  //
  //   Navigation.startSingleScreenApp({
  //     screen: {
  //       screen: 'com.puyosimulator.Viewer',
  //     },
  //     appStyle: {
  //       orientation: 'portrait'
  //     },
  //     animationType: 'none',
  //     portraitOnlyMode: true,
  //   });
  //
  //   // this.props.navigator.push({ screen: 'com.puyosimulator.Viewer' });
  //   return;
  // }


  if (Platform.OS === 'ios') {
    const icon = await Icon.getImageSource('menu', 24);
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'com.puyosimulator.Simulator',
        navigatorButtons: {
          rightButtons: [
            {
              icon: icon,
              id: 'menu'
            }
          ]
        }
      },
      appStyle: {
        orientation: 'portrait'
      },
      animationType: 'none',
      portraitOnlyMode: true,
    });
  } else {
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
}

launch();