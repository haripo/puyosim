/**
 * Base component
 */

import * as _ from 'lodash';
import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import {
  contentsMargin,
  themeColor,
  themeLightColor
} from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import t from '../../shared/utils/i18n';
import SimulatorControls from '../../shared/components/SimulatorControls';

export default class Simulator extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: t('about'),
        id: 'about',
        showAsAction: 'never'
      },
      {
        title: t('settings'),
        id: 'settings',
        showAsAction: 'never'
      },
      {
        title: t('shareViaTwitter'),
        id: 'share-via-ips',
        showAsAction: 'never'
      },
      {
        title: t('restart'),
        id: 'restart',
        showAsAction: 'never'
      },
      {
        title: t('reset'),
        id: 'reset',
        showAsAction: 'never'
      },
      {
        title: t('history'),
        id: 'history',
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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.props.navigator.setTitle({ title: "puyosim" });
  }

  componentDidMount() {
    this.props.onSimulatorLaunched();
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
        case 'restart':
          Alert.alert(
            t('restart'),
            t('confirmRestart'),
            [
              { text: 'Cancel', onPress: _.noop, style: 'cancel' },
              { text: 'OK', onPress: this.props.onRestartSelected }
            ],
            { cancelable: false }
          );
          break;
        case 'history':
          this.props.navigator.push({ screen: 'com.puyosimulator.History' });
          break;
        case 'share-via-ips':
          this.props.onShareSelected();
          break;
        case 'settings':
          this.props.navigator.push({ screen: 'com.puyosimulator.Settings' });
          break;
        case 'about':
          this.props.navigator.push({ screen: 'com.puyosimulator.About' });
          break;
      }
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <View>
            <HandlingPuyos
              pair={ this.props.pendingPair }
              puyoSkin={ this.props.puyoSkin }>
            </HandlingPuyos>
            <Field
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              droppingPuyos={ this.props.droppingPuyos }
              vanishingPuyos={ this.props.vanishingPuyos }
              isActive={ this.props.isActive }
              style={ styles.field }
              puyoSkin={ this.props.puyoSkin }
              onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
              onSwiping={ this.props.onSwiping }
              onSwipeEnd={ this.props.onSwipeEnd }>
            </Field>
          </View>
          <View style={ styles.side }>
            <View style={ styles.sideHead }>
              <NextWindowContainer />
              <ChainResultContainer />
            </View>
            <SimulatorControls
              onUndoSelected={ this.props.onUndoSelected }
              onRedoSelected={ this.props.onRedoSelected }
              onRotateLeftPressed={ this.props.onRotateLeftPressed }
              onRotateRightPressed={ this.props.onRotateRightPressed }
              onMoveLeftPressed={ this.props.onMoveLeftPressed }
              onMoveRightPressed={ this.props.onMoveRightPressed }
              onDropPressed={ this.props.onDropPressed }
              isActive={ this.props.isActive }
              canUndo={ this.props.canUndo }
              canRedo={ this.props.canRedo }
            />
          </View>
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
    backgroundColor: '#F5F5F5'
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
  sideHead: {
    flex: 1
  },
  field: {
    margin: contentsMargin
  }
});
