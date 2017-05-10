/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { puyoSize } from '../utils/constants';
import Puyo from './Puyo';
import GhostPuyo from './GhostPuyo';

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

  eventToPosition(event: Object) {
    return {
      row: Math.floor(event.nativeEvent.locationY / puyoSize),
      col: Math.floor(event.nativeEvent.locationX / puyoSize)
    };
  }

  gestureStateToDirection(gestureState: Object) {
    const { dx, dy } = gestureState;
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
    this.props.onSwiping(
      this.eventToPosition(e),
      this.gestureStateToDirection(gestureState));
  }

  handlePanResponderEnd(e: Object, gestureState: Object) {
    this.props.onSwipeEnd(
      this.eventToPosition(e),
      this.gestureStateToDirection(gestureState));
  }

  renderStack(stack) {
    const { highlights, ghosts, droppingPuyos } = this.props;
    const renderPuyo = (puyo, row, col) => {
      const containerStyle = () => {
        const highlight = highlights.find(h => h.row == row && h.col == col);

        if (highlight) {
          return [styles.puyoContainer, styles.highlight];
        } else {
          return [styles.puyoContainer];
        }
      };

      const ghost = ghosts.find(g => g.row == row && g.col == col);
      const puyoInfo = droppingPuyos.find(g => g.row == row && g.col == col);
      const altitude = puyoInfo ? puyoInfo.altitude : 0;

      if (ghost) {
        return (
          <View
            pointerEvents="none"
            style={ containerStyle() }
            key={ col }>
            <GhostPuyo size={ puyoSize } puyo={ ghost.color } />
          </View>
        )
      } else {
        return (
          <View
            pointerEvents="none"
            style={ containerStyle() }
            key={ col }>
            <Puyo size={ puyoSize } puyo={ puyo } shiftY={ -altitude }/>
          </View>
        )
      }
    };

    const renderRow = (row, rowIndex) => {
      return (
        <View style={ styles.fieldRow } key={ rowIndex }>
          { row.map((item, colIndex) => renderPuyo(item, rowIndex, colIndex)) }
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
  },
  highlight: {
    borderColor: 'yellow',
    borderWidth: 1
  }
});