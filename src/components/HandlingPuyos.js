/**
 * Component for render pair on handling state
 */
import React from 'react';
import Puyo from './Puyo';
import { puyoSize, contentsPadding, contentsMargin, fieldCols } from '../utils/constants';
import { View } from 'react-native';

export default class HandlingPuyos extends Puyo {
  render() {
    const { pair } = this.props;

    return (
      <View style={ styles.container }>
        <Puyo
          x={ pair[0].col * puyoSize + contentsPadding }
          y={ pair[0].row * puyoSize + contentsPadding }
          puyo={ pair[0].color }
          size={ puyoSize }>
        </Puyo>
        <Puyo
          x={ pair[1].col * puyoSize + contentsPadding }
          y={ pair[1].row * puyoSize + contentsPadding }
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
    height: puyoSize * 3 + contentsPadding * 2,
    backgroundColor: "#BBBBBB"
  }
};