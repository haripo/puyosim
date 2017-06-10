/**
 * Component for render pair on handling state
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { contentsPadding, fieldCols, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class HandlingPuyos extends Component {
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
    backgroundColor: '#BBBBBB'
  }
};