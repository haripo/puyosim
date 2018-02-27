/**
 * Component for render next and double-next pairs
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

function renderPair(pair, puyoSkin) {
  return (
    <View style={ styles.nextWindow }>
      <Puyo
        puyo={ pair[1] }
        size={ puyoSize }
        skin={ puyoSkin }
        x={ contentsPadding }
        y={ contentsPadding }/>
      <Puyo
        puyo={ pair[0] }
        size={ puyoSize }
        skin={ puyoSkin }
        x={ contentsPadding }
        y={ contentsPadding + puyoSize }/>
    </View>
  );
}

function render(props) {
  const { next, doubleNext, puyoSkin } = props;
  return (
    <View style={ styles.component }>
        { renderPair(next, puyoSkin) }
        { doubleNext ? renderPair(doubleNext, puyoSkin) : null }
    </View>
  );
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

export default NextWindow = render;
