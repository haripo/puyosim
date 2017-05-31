/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { Button, StyleSheet, Text, ToolbarAndroid, TouchableOpacity, View } from 'react-native';
import { contentsMargin, contentsPadding, controllerButtonSize } from '../utils/constants';
import Field from './Field';
import NextWindow from './NextWindow';
import NoticePuyos from './NoticePuyos';
import HandlingPuyos from './HandlingPuyos';
import { Alert } from 'react-native';
import * as _ from 'lodash';

export default class Simulator extends Component {
  constructor() {
    super();
    this.actions = [
      { title: '1 手戻す' },
      { title: '初手に戻す' },
      { title: 'リスタート' }
    ];
  }

  handleToolbarAction(position) {
    switch (position) {
      case 0:
        this.props.onUndoSelected();
        break;
      case 1:
        this.props.onResetSelected();
        break;
      case 2:
        Alert.alert(
          'リスタート',
          'ツモが再生成されます。よろしいですか？',
          [
            { text: 'Cancel', onPress: _.noop, style: 'cancel' },
            { text: 'OK', onPress: this.props.onRestartSelected },
          ],
          { cancelable: false }
        );
        break;
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <ToolbarAndroid
          actions={ this.actions }
          style={ styles.toolbar }
          title='ぷよシミュレータ'
          onActionSelected={ ::this.handleToolbarAction }/>
        <View style={ styles.contents }>
          <View>
            <HandlingPuyos pair={ this.props.ghosts }>
            </HandlingPuyos>
            <Field
              stack={ this.props.stack }
              highlights={ this.props.highlights }
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
              <NextWindow
                next={ this.props.next }
                doubleNext={ this.props.doubleNext }/>
              <Text>
                おじゃまぷよ
              </Text>
              <NoticePuyos score={ this.props.score }>
              </NoticePuyos>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={ styles.rotateButtons }>
                <TouchableOpacity style={ styles.controllerButton }>
                  <Text>L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.controllerButton }>
                  <Text>R</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.horizontalArrowButtons }>
                <TouchableOpacity style={ styles.controllerButton }>
                  <Text>L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.controllerButton }>
                  <Text>R</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={ styles.controllerFullWidthButton }>
                <Text>D</Text>
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
    flex: 1,
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
    backgroundColor: '#BBF',
    width: controllerButtonSize,
    height: controllerButtonSize,
    marginBottom: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controllerFullWidthButton: {
    backgroundColor: '#BBF',
    width: controllerButtonSize * 2 + contentsMargin,
    height: controllerButtonSize,
    justifyContent: 'center',
    alignItems: 'center'
  },
  field: {
    backgroundColor: '#BBBBBB',
    margin: contentsMargin
  }
});