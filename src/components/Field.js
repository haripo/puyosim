/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { puyoSize } from '../utils/constants';
import Puyo from './Puyo';

/**
 * Component for render puyo fields
 */
export default class Field extends Component {
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

  renderStack(stack) {
    const renderPuyo = (puyo, index) => {
      return (
        <View
          pointerEvents="none"
          style={ styles.puyoContainer }
          key={ index }>
          <Puyo size={ puyoSize } puyo={ puyo }/>
        </View>
      )
    };

    const renderRow = (row, index) => {
      return (
        <View style={ styles.fieldRow } key={ index }>
          { row.map(renderPuyo) }
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