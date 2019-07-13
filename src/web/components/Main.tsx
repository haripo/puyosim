import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import WebToolbar from './WebToolbar';
import Sidenav from './Sidenav';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';
import { Route, RouteComponentProps } from 'react-router-dom'
import SimulatorContainer from '../containers/SimulatorContainer';
import EditorContainer from '../containers/EditorContainer';

export interface Props extends RouteComponentProps<{}> {
}

type State = {
  shareModalIsOpen: boolean
}

export default class Main extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      shareModalIsOpen: false
    }
  }


  render() {
    return (
      <View
        style={ {
          display: 'flex',
          alignItems: 'stretch',
          flexGrow: 1,
          flexDirection: 'column'
        } }>
        <WebToolbar/>
        <LayoutBaseContainer>
          <View style={ styles.container }>
            <Sidenav
              path={ this.props.location.pathname }
              style={ {
                alignItems: 'stretch',
                width: 200,
              } }>
            </Sidenav>
            <View style={ {
              flex: 1
            } }>
              <Route
                key={ 'simulator' }
                path={ '/s' }
                exact={ false }
                component={ () => <SimulatorContainer/> }
              />
              <Route
                key={ 'editor' }
                path={ '/e' }
                exact={ false }
                component={ () => <EditorContainer/> }
              />
            </View>
          </View>
        </LayoutBaseContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
  },
  side: {
    justifyContent: 'space-between',
    width: 340
  },
  hotkeyElement: {
    borderWidth: 0
  }
});
