/**
 * Component for render next and double-next pairs
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class NextWindow extends Component {
  renderPair(pair) {
    return (
      <View style={ styles.nextWindow }>
        <Puyo
          puyo={ pair[1] }
          size={ puyoSize }
          x={ contentsPadding }
          y={ contentsPadding }/>
        <Puyo
          puyo={ pair[0] }
          size={ puyoSize }
          x={ contentsPadding }
          y={ contentsPadding + puyoSize }/>
      </View>
    );
  }

  render() {
    const { next, doubleNext } = this.props;
    return (
      <View style={ styles.component }>
          { this.renderPair(next) }
          { doubleNext ? this.renderPair(doubleNext) : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    backgroundColor: cardBackgroundColor,
    elevation: 2
  },
  nextWindow: {
    width: puyoSize + contentsPadding * 2,
    height: puyoSize * 2 + contentsPadding * 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});