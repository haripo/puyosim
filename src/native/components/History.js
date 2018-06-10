/**
 * Base component
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  buttonColor,
  contentsMargin,
  controllerButtonSize,
  screenHeight,
  screenWidth,
  themeColor,
  themeLightColor
} from '../../shared/utils/constants';
import t from '../../shared/service/i18n';
import HistoryTree from '../../shared/components/HistoryTree/HistoryTree';

export default class Simulator extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: t('reset'),
        id: 'reset',
        showAsAction: 'never'
      },
      {
        title: t('undo'),
        id: 'undo',
        showAsAction: 'never'
      }
    ]
  };

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(::this.onNavigatorEvent);
    this.props.navigator.setTitle({ title: 'puyosim' })
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'undo':
          this.props.onUndoSelected();
          break;
        case 'reset':
          this.props.onResetSelected();
          break;
      }
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <HistoryTree
            history={ this.props.history }
            historyTreeLayout={ this.props.historyTreeLayout }
            width={ screenWidth }
            height={ screenHeight }
            currentIndex={ this.props.historyIndex }
            onNodePressed={ this.props.onHistoryNodePressed }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5',
  },
  contents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  side: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: contentsMargin,
    marginRight: contentsMargin,
    marginBottom: contentsMargin
  },
  nextWindow: {
    marginBottom: contentsMargin,
  },
  recordList: {
    marginBottom: contentsMargin,
    flex: 1
  },
  buttons: {},
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerButton: {
    width: controllerButtonSize,
    height: controllerButtonSize,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3,
  },
  controllerFullWidthButton: {
    backgroundColor: buttonColor,
    width: controllerButtonSize * 2 + contentsMargin,
    height: controllerButtonSize,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3,
  },
  controllerButtonImage: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain'
  },
  field: {
    margin: contentsMargin
  }
});
