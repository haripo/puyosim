/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  PanResponder
} from 'react-native';
import { puyoSize } from '../utils/constants';

/**
 * Component for render puyo field
 */
export default class Field extends Component {
  constructor() {
    super();
    this.images = [
      null,
      require('../../assets/puyo_red.png'),
      require('../../assets/puyo_green.png'),
      require('../../assets/puyo_blue.png'),
      require('../../assets/puyo_yellow.png')
    ]
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (() => true),
      onMoveShouldSetPanResponder: (() => true),
      onPanResponderGrant: ::this.handlePanResponderGrant,
      onPanResponderMove: ::this.handlePanResponderMove,
      onPanResponderRelease: ::this.handlePanResponderEnd,
      onPanResponderTerminate: ::this.handlePanResponderEnd
    });
  }

  handlePanResponderGrant() {
  }

  handlePanResponderMove(e: Object, gestureState: Object) {
  }

  handlePanResponderEnd(e: Object, gestureState: Object) {
    let position = {
      row: Math.floor(e.nativeEvent.locationY / puyoSize),
      col: Math.floor(e.nativeEvent.locationX / puyoSize)
    };
    let direction = 0;
    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
      direction = { row: 0, col: gestureState.dx > 0 ? 1 : -1 }
    } else {
      direction = { row: gestureState.dy > 0 ? 1 : -1, col: 0 }
    }

    this.props.put([1, 2], position, direction)
  }

  renderPuyo(puyo, index) {
    const image = this.images[puyo];
    if (image) {
      return (
        <Image source={ image } style={ styles.puyo } key={ index }/>
      )
    } else {
      return (
        <View style={ styles.puyo } key={ index }>
        </View>
      )
    }
  }

  renderStack(stack) {
    const renderRow = (row, index) => {
      return (
        <View style={ styles.fieldRow } key={ index }>
          { row.map(::this.renderPuyo) }
        </View>
      )
    };

    return (
      <View>
        { stack.map(renderRow) }
      </View>
    );
  }

  render() {
    return (
      <View style={ this.props.style } { ...this.panResponder.panHandlers }>
        { this.renderStack(this.props.stack) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row'
  },
  puyo: {
    width: puyoSize,
    height: puyoSize
  }
});