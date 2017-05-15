/**
 * Base component
 * @flow
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { fieldCols, fieldRows, puyoSize } from '../utils/constants';
import GhostPuyo from './GhostPuyo';
import Puyo from './Puyo';

/**
 * Component for render puyo fields
 */
export default class Field extends Component {
  constructor() {
    super();
    this.state = {
      droppings: [],
      vanishings: []
    };
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

  componentWillReceiveProps(nextProps) {
    const { droppings, vanishings } = this.state;

    if (droppings.length === 0 && nextProps.droppingPuyos.length !== 0) {
      this.launchDroppingAnimation(nextProps.droppingPuyos)
    }

    if (vanishings.length === 0 && nextProps.vanishingPuyos.length !== 0) {
      this.launchVanishingAnimation(nextProps.vanishingPuyos)
    }
  }

  launchDroppingAnimation(droppingPuyos) {
    let progress = 0;

    // launch animation
    const next = () => {
      const animatingPuyos = droppingPuyos
        .filter(p => progress < p.altitude * puyoSize)
        .map(p => ({
          ...p,
          value: (p.row - p.altitude) * puyoSize + progress
        }));

      this.setState({ droppings: animatingPuyos });

      progress += puyoSize / 2;

      if (animatingPuyos.length > 0) {
        requestAnimationFrame(next);
      } else {
        this.props.onDroppingAnimationFinished();
      }
    };
    next();
  }

  launchVanishingAnimation(vanishingPuyos) {
    let progress = 0;

    const next = () => {
      const animatingPuyos = vanishingPuyos
        .filter(p => progress < 30)
        .map(p => {
          return {
            ...p,
            value: progress % 2 === 0 ? 0.3 : 1
          }
        });

      this.setState({ vanishings: animatingPuyos });
      progress += 1;

      if (animatingPuyos.length > 0) {
        requestAnimationFrame(next);
      } else {
        this.props.onVanishingAnimationFinished();
      }
    };
    next();
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
    const { highlights, ghosts } = this.props;
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
            const droppingInfo = _.find(this.state.droppings, g => g.row === row && g.col === col);
            return (
              <Puyo
                size={ puyoSize }
                puyo={ puyo }
                x={ col * puyoSize }
                y={ (droppingInfo ? droppingInfo.value : row * puyoSize) }/>
            );
          });
        }));

      const vanishingPuyoDoms = this.state.vanishings.map(vanishing => (
        <Puyo
          size={ puyoSize }
          puyo={ vanishing.color }
          x={ vanishing.col * puyoSize }
          y={ vanishing.row * puyoSize }
          a={ vanishing.value }/>
      ));

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
        highlightDoms,
        vanishingPuyoDoms
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