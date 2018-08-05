/**
 * Base component
 */

import React, { Component } from 'react';
import { Image, PanResponder, StyleSheet, View } from 'react-native';
import DroppingPuyosContainer from '../containers/DroppingPuyosContainer';
import VanishingPuyosContainer from '../containers/VanishingPuyosContainer';
import {
  cardBackgroundColor,
  contentsPadding,
  fieldCols, fieldHeight,
  fieldRows,
  fieldWidth,
  puyoSize,
  themeColor
} from '../utils/constants';
import GhostPuyo from './GhostPuyo';
import Puyo from './Puyo';

/**
 * Component for render puyo fields
 */
export default class Field extends Component {
  constructor() {
    super();
    this.state = {
      vanishings: []
    };
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
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'bottom' : 'top';
    }
  }

  renderStack(stack) {
    const { ghosts } = this.props;
    const renderPuyos = (stack) => {
      const puyoDoms = stack
        .map((puyos, row) => {
          return puyos.map((puyo, col) => {
            if (puyo.color === 0 || puyo.isDropping) return null;
            return (
              <Puyo
                size={ puyoSize }
                puyo={ puyo.color }
                x={ col * puyoSize + contentsPadding }
                y={ row * puyoSize + contentsPadding }
                connections={ puyo.connections }
                skin={ this.props.puyoSkin }
                key={ `puyo-${row}-${col}` }/>
            );
          });
        });

      const ghostDoms = ghosts.map((ghost, i) => {
        return (
          <GhostPuyo
            size={ puyoSize }
            puyo={ ghost.color }
            skin={ this.props.puyoSkin }
            key={ i }
            x={ ghost.col * puyoSize + contentsPadding }
            y={ ghost.row * puyoSize + contentsPadding }/>
        );
      });

      return [
        this.props.isActive ? ghostDoms : null,
        puyoDoms
      ];
    };

    return renderPuyos(stack);
  }

  render() {
    return (
      <View style={ [this.props.style, styles.field] } >
        { this.renderStack(this.props.stack) }
        <Image source={ require('../../../assets/cross.png') } style={ styles.cross }/>
        <DroppingPuyosContainer />
        <VanishingPuyosContainer />
        <View style={ styles.topShadow }></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: cardBackgroundColor,
    elevation: 2,
    width: fieldWidth,
    height: fieldHeight,
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
  },
  cross: {
    position: 'absolute',
    width: puyoSize,
    height: puyoSize,
    top: puyoSize + contentsPadding,
    left: puyoSize * 2 + contentsPadding
  },
  topShadow: {
    width: puyoSize * fieldCols + contentsPadding * 2,
    height: puyoSize + contentsPadding,
    backgroundColor: themeColor,
    opacity: 0.2,
    position: 'absolute',
    top: 0,
    left: 0,
  }
});
