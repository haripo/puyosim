/**
 * Puyo simulator app
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Simulator from './src/containers/SimulatorContainer';
import field from './src/reducers/field';

let store = createStore(field);

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
