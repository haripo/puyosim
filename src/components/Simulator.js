/**
 * Base component
 * @flow
 */

import * as _ from 'lodash';
import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, ToolbarAndroid, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../containers/NextWindowContainer';
import NoticePuyosContainer from '../containers/NoticePuyosContainer';
import { contentsMargin, controllerButtonSize } from '../utils/constants';
import Field from './Field';
import HandlingPuyos from './HandlingPuyos';

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

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(::this.onNavigatorEvent);
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
              <NoticePuyosContainer />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={ styles.rotateButtons }>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateLeftPressed }>
                  <Image source={ require('../../assets/control_a.png') } style={ styles.controllerButtonImage }/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateRightPressed }>
                  <Image source={ require('../../assets/control_b.png') } style={ styles.controllerButtonImage }/>
                </TouchableOpacity>
              </View>
              <View style={ styles.horizontalArrowButtons }>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onMoveLeftPressed }>
                  <Image source={ require('../../assets/control_left.png') } style={ styles.controllerButtonImage }/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onMoveRightPressed }>
                  <Image source={ require('../../assets/control_right.png') } style={ styles.controllerButtonImage }/>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={ styles.controllerFullWidthButton }
                onPress={ this.props.onDropPressed }>
                <Image source={ require('../../assets/control_down.png') } style={ styles.controllerButtonImage }/>
              </TouchableOpacity>
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
    backgroundColor: '#f5fcff'
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56
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
  rotateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  horizontalArrowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controllerButton: {
    backgroundColor: '#999',
    width: controllerButtonSize,
    height: controllerButtonSize,
    marginBottom: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controllerFullWidthButton: {
    backgroundColor: '#999',
    width: controllerButtonSize * 2 + contentsMargin,
    height: controllerButtonSize,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controllerButtonImage: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain'
  },
  field: {
    backgroundColor: '#BBBBBB',
    margin: contentsMargin
  }
});