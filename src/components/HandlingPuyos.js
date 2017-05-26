/**
 * Component for render pair on handling state
 */
import React from 'react';
import Puyo from './Puyo';
import { puyoSize, contentsPadding, contentsMargin, fieldCols } from '../utils/constants';
import { View } from 'react-native';

export default class HandlingPuyos extends Puyo {
  render() {
    const pair = this.props.pair.sort((a, b) => a.row > b.row);
    const isVertical = pair.length > 1 && pair[0].col === pair[1].col;

    if (pair.length < 2) {
      return <View style={ styles.container }/>
    }

    return (
      <View style={ styles.container }>
        <Puyo
          x={ pair[0].col * puyoSize + contentsPadding }
          y={ (isVertical ? 0 : 0.5) * puyoSize + contentsPadding }
          puyo={ pair[0].color }
          size={ puyoSize }>
        </Puyo>
        <Puyo
          x={ pair[1].col * puyoSize + contentsPadding }
          y={ (isVertical ? 1 : 0.5) * puyoSize + contentsPadding }
          puyo={ pair[1].color }
          size={ puyoSize }>
        </Puyo>
      </View>
    );
  }
}

const styles = {
  container: {
    marginTop: 3,
    marginLeft: 3,
    width: puyoSize * fieldCols + contentsPadding * 2,
    height: puyoSize * 2 + contentsPadding * 2,
    backgroundColor: "#BBBBBB"
  }
};