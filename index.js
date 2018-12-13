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
import Archive from './src/native/screens/ArchiveContainer';
import SaveModal from './src/native/screens/SaveModalContainer';
import RightDrawer from './src/native/screens/RightDrawerContainer';
import { getStore } from './src/shared/store/store';

import sagas from './src/shared/sagas';
import reducers from './src/shared/reducers'

import { SENTRY_DSN } from 'react-native-dotenv'

import { Sentry } from 'react-native-sentry';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { themeColor, themeLightColor } from './src/shared/utils/constants';

if (!__DEV__ && SENTRY_DSN) {
  Sentry
    .config(SENTRY_DSN)
    .install();
}

const store = getStore(reducers, sagas);

// Register screen components
Navigation.registerComponentWithRedux('com.puyosimulator.Simulator', () => Simulator, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.History', () => History, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.About', () => About, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.Settings', () => Settings, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.Share', () => Share, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.Viewer', () => Viewer, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.Archive', () => Archive, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.SaveModal', () => SaveModal, Provider, store);
Navigation.registerComponentWithRedux('com.puyosimulator.RightDrawer', () => RightDrawer, Provider, store);

async function launch() {
  const icon = await Icon.getImageSource('menu', 24);
  Navigation.setRoot({
    root: {
      sideMenu: {
        id: "sideMenu",
        right: {
          component: {
            name: "com.puyosimulator.RightDrawer"
          }
        },
        center: {
          stack: {
            id: 'centerStack',
            children: [
              {
                component: {
                  name: 'com.puyosimulator.Simulator',
                  options: {
                    topBar: {
                      rightButtons: [
                        {
                          icon: icon,
                          id: 'menu',
                          color: 'white'
                        }
                      ],
                    }
                  }
                }
              }
            ],
            options: {
              sideMenu: {
                right: {
                  enabled: false,
                  visible: false
                },
                openGestureMode: "bezel"
              }
            }
          }
        }
      }
    }
  });

  // FIXME: これを setRoot の前に持っていくと動かなくなる
  Navigation.setDefaultOptions({
    topBar: {
      title: {
        color: themeLightColor
      },
      background: {
        color: themeColor
      },
      animate: true,
      buttonColor: themeLightColor,
      backButton: {
        color: 'white'
      },
    },
    layout: {
      orientation: ['portrait']
    },
    sideMenu: {
      right: {
        enabled: false
      }
    }
  });
}

launch();