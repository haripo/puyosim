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
  fieldCols,
  fieldRows,
  themeColor
} from '../utils/constants';
import GhostPuyo from './GhostPuyo';
import Puyo from './Puyo';
import { Layout } from '../selectors/layoutSelectors';

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

  eventToPosition(event) {
    const { layout } = this.props;
    return {
      row: Math.floor(event.nativeEvent.locationY / layout.puyoSize),
      col: Math.floor(event.nativeEvent.locationX / layout.puyoSize)
    };
  }

  gestureStateToDirection(gestureState) {
    const { dx, dy } = gestureState;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'bottom' : 'top';
    }
  }

  renderStack(stack) {
    const { ghosts, layout } = this.props;
    const renderPuyos = (stack) => {
      const puyoDoms = stack
        .map((puyos, row) => {
          return puyos.map((puyo, col) => {
            if (puyo.color === 0 || puyo.isDropping) return null;
            return (
              <Puyo
                size={ layout.puyoSize }
                puyo={ puyo.color }
                x={ col * layout.puyoSize + contentsPadding }
                y={ row * layout.puyoSize + contentsPadding }
                connections={ puyo.connections }
                skin={ this.props.puyoSkin }
                key={ `puyo-${row}-${col}` }/>
            );
          });
        });

      const ghostDoms = ghosts.map((ghost, i) => {
        return (
          <GhostPuyo
            size={ layout.puyoSize }
            puyo={ ghost.color }
            skin={ this.props.puyoSkin }
            key={ i }
            x={ ghost.col * layout.puyoSize + contentsPadding }
            y={ ghost.row * layout.puyoSize + contentsPadding }/>
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
    const styles = createStyles(this.props.layout);

    return (
      <View style={ [this.props.style, styles.field] } >
        { this.renderStack(this.props.stack) }
        <Image source={ require('../../../assets/cross.png') } style={ styles.cross }/>
        <DroppingPuyosContainer />
        <VanishingPuyosContainer />
        <View style={ styles.topShadow } />
      </View>
    );
  }
}

function createStyles(layout: Layout) {
  return StyleSheet.create({
    field: {
      backgroundColor: cardBackgroundColor,
      elevation: 2,
      width: layout.field.width,
      height: layout.field.height
    },
    cross: {
      position: 'absolute',
      width: layout.puyoSize,
      height: layout.puyoSize,
      top: layout.puyoSize + contentsPadding,
      left: layout.puyoSize * 2 + contentsPadding
    },
    topShadow: {
      width: layout.puyoSize * fieldCols + contentsPadding * 2,
      height: layout.puyoSize + contentsPadding,
      backgroundColor: themeColor,
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      left: 0,
    }
  });
}