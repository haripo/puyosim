/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';
import { puyoSize, fieldRows, fieldCols } from '../utils/constants';
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
    const renderPuyos = (stack) => {
      const highlightDoms = highlights.map((highlight) => {
        return (
          <View
            style={ styles.highlight }
            top={ highlight.row * puyoSize }
            left={ highlight.col * puyoSize }>
          </View>
        );
      });

      const puyoDoms = _.flatten(stack
        .map((puyos, row) => {
          return puyos.map((puyo, col) => {
            const puyoInfo = droppingPuyos.find(g => g.row == row && g.col == col);
            const altitude = puyoInfo ? puyoInfo.altitude : 0;
            return (
              <Puyo
                size={ puyoSize }
                puyo={ puyo }
                x={ col * puyoSize }
                y={ row * puyoSize - altitude }/>
            );
          });
        }));

      const ghostDoms = ghosts.map(ghost => {
        return (
          <GhostPuyo
            size={ puyoSize }
            puyo={ ghost.color }
            x={ ghost.col * puyoSize }
            y={ ghost.row * puyoSize }/>
        );
      });

      return [
        ghostDoms,
        puyoDoms,
        highlightDoms
      ];
    };

    return renderPuyos(stack);
  }

  render() {
    return (
      <View
        style={ [this.props.style, styles.field] }
        { ...this.panResponder.panHandlers }>
        { this.renderStack(this.props.stack) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    width: puyoSize * fieldCols,
    height: puyoSize * fieldRows
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
    position: 'absolute',
    borderColor: 'yellow',
    borderWidth: 1,
    width: puyoSize,
    height: puyoSize
  }
});