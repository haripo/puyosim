import '@babel/polyfill';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import MainContainer from './src/web/containers/MainContainer';
import { getStore } from './src/shared/store/store';
import sagas from './src/shared/sagas';
import reducers from './src/shared/reducers'
import './src/web/misc/icon';

class App extends Component {
  render() {
    return (
      <Provider store={ this.props.store }>
        <BrowserRouter>
          <Switch>
            <Route path='/s' component={ MainContainer }/>
            <Route path='/v' component={ MainContainer }/>
            <Route path='/e' component={ MainContainer }/>
          </Switch>
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