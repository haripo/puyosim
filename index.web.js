import 'babel-polyfill';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { BrowserRouter, Route } from 'react-router-dom'

import Simulator from './src/web/containers/SimulatorContainer';
import { getStore } from './src/shared/store/store';
import sagas from './src/shared/sagas';
import reducers from './src/shared/reducers'
import './src/web/misc/icon';

class App extends Component {
  render() {
    return (
      <Provider store={ this.props.store }>
        <BrowserRouter>
          <Route exact path='/s' component={ Simulator }/>
        </BrowserRouter>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('App', () => App);

const store = getStore(reducers, sagas);

setTimeout(() => {
  AppRegistry.runApplication('App', {
    initialProps: { store },
    rootTag: document.getElementById('root')
  });
});

window.store = store; // for debug