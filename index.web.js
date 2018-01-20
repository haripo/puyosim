import "babel-polyfill";

import _ from 'lodash';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import Simulator from './src/web/containers/SimulatorContainer';
import reducer from './src/shared/reducers';
import sagas from './src/shared/sagas';
import './src/web/misc/icon';

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Simulator/>
      </Provider>
    )
  }
}

const stateTransformer = (state) => {
  return _.mapValues(state, v => v.toJS());
};

const logger = createLogger({
  stateTransformer
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware/*, logger*/)));

sagaMiddleware.run(sagas);

AppRegistry.registerComponent('App', () => App);

setTimeout(() => {
  AppRegistry.runApplication('App', {
    initialProps: { store },
    rootTag: document.getElementById('root')
  });
});