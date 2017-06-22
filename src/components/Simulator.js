/**
 * Base component
 * @flow
 */

import * as _ from 'lodash';
import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, ToolbarAndroid, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../containers/NextWindowContainer';
import ChainResultContainer from '../containers/ChainResultContainer';
import { buttonColor, contentsMargin, controllerButtonSize, themeColor, themeLightColor } from '../utils/constants';
import Field from './Field';
import HandlingPuyos from './HandlingPuyos';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Simulator extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: 'リスタート',
        id: 'restart',
        showAsAction: 'never'
      },
      {
        title: '初手に戻す',
        id: 'reset',
        showAsAction: 'never'
      },
      {
        title: '1 手戻す',
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
    this.props.navigator.setTitle({ title: "puyosim" })
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
            'リスタート',
            'ツモが再生成されます。よろしいですか？',
            [
              { text: 'Cancel', onPress: _.noop, style: 'cancel' },
              { text: 'OK', onPress: this.props.onRestartSelected }
            ],
            { cancelable: false }
          );
          break;
      }
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <View>
            <HandlingPuyos pair={ this.props.pendingPair }>
            </HandlingPuyos>
            <Field
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              droppingPuyos={ this.props.droppingPuyos }
              vanishingPuyos={ this.props.vanishingPuyos }
              isActive={ this.props.isActive }
              style={ styles.field }
              onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
              onSwiping={ this.props.onSwiping }
              onSwipeEnd={ this.props.onSwipeEnd }>
            </Field>
          </View>
          <View style={ styles.side }>
            <View style={ styles.sideHead }>
              <Text>
                NEXT
              </Text>
              <NextWindowContainer />
              <Text>
                おじゃまぷよ
              </Text>
              <ChainResultContainer />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={ styles.buttonGroup }>
                <TouchableOpacity
                  style={ styles.controllerFullWidthButton }
                  onPress={ this.props.onUndoSelected }>
                  <Icon name="undo" size={30} color="#FFF" />
                  <Text style={{ color: '#FFF' }}>Undo</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.buttonGroup }>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateLeftPressed }>
                  <Icon name="rotate-left" size={30} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateRightPressed }>
                  <Icon name="rotate-right" size={30} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttons}>
                <View style={ styles.buttonGroup }>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onMoveLeftPressed }>
                    <Icon name="arrow-back" size={30} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onMoveRightPressed }>
                    <Icon name="arrow-forward" size={30} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={ styles.controllerFullWidthButton }
                  onPress={ this.props.onDropPressed }>
                  <Icon name="arrow-downward" size={30} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
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
  buttons: {
  },
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