/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { Image, PanResponder, StyleSheet, View } from 'react-native';
import { puyoSize } from '../utils/constants';

/**
 * Component for render puyo pairQueue
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
    ];
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

  convertLocation(x: Number, y: Number) {
    return {
      row: Math.floor(y / puyoSize),
      col: Math.floor(x / puyoSize)
    };
  }

  convertDirection(dx: Number, dy: Number) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        row: 0,
        col: dx > 0 ? 1 : -1
      };
    } else {
      return {
        row: dy > 0 ? 1 : -1,
        col: 0
      };
    }
  }

  handlePanResponderGrant() {
  }

  handlePanResponderMove(e: Object, gestureState: Object) {
  }

  handlePanResponderEnd(e: Object, gestureState: Object) {
    const position = this.convertLocation(
      e.nativeEvent.locationX,
      e.nativeEvent.locationY);
    const direction = this.convertDirection(gestureState.dx, gestureState.dy);

    this.props.onSwipeEnd(position, direction);
  }

  renderPuyo(puyo, index) {
    const image = this.images[puyo];
    if (image) {
      return (
        <View
          pointerEvents="none"
          style={ styles.puyoContainer }
          key={ index }>
          <Image
            style={ styles.puyo }
            source={ image }/>
        </View>
      );
    } else {
      return (
        <View style={ styles.puyoContainer } key={ index }>
        </View>
      );
    }
  }

  renderStack(stack) {
    const renderRow = (row, index) => {
      return (
        <View style={ styles.fieldRow } key={ index }>
          { row.map(::this.renderPuyo) }
        </View>
      );
    };

    return (
      <View>
        { stack.map(renderRow) }
      </View>
    );
  }

  render() {
    return (
      <View
        style={ this.props.style }
        { ...this.panResponder.panHandlers }>
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
  },
  puyoContainer: {
    width: puyoSize,
    height: puyoSize
  }
});