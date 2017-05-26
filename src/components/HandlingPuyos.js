/**
 * Component for render pair on handling state
 */
import React from 'react';
import Puyo from './Puyo';
import { puyoSize, contentsPadding, contentsMargin, fieldCols } from '../utils/constants';
import { View } from 'react-native';

export default class HandlingPuyos extends Puyo {
  render() {
    return (
      <View style={ styles.container }>

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