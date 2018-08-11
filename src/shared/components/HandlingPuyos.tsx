import React, { Component } from 'react';
import { View } from 'react-native';
import { cardBackgroundColor, contentsPadding, fieldCols } from '../utils/constants';
import Puyo from './Puyo';
import { Layout } from "../selectors/layoutSelectors";
import { PendingPair } from "../selectors/simulatorSelectors";

export type Props = {
  pair: PendingPair,
  layout: Layout,
  puyoSkin: string
}

/**
 * Component for render pair
 */
export default class HandlingPuyos extends Component<Props, {}> {
  render() {
    const { pair, puyoSkin, layout } = this.props;
    const { puyoSize } = layout;

    return (
      <View style={ this.getStyle() }>
        <Puyo
          x={ pair[0].col * puyoSize + contentsPadding }
          y={ pair[0].row * puyoSize + contentsPadding }
          puyo={ pair[0].color }
          skin={ puyoSkin }
          size={ puyoSize }>
        </Puyo>
        <Puyo
          x={ pair[1].col * puyoSize + contentsPadding }
          y={ pair[1].row * puyoSize + contentsPadding }
          puyo={ pair[1].color }
          skin={ puyoSkin }
          size={ puyoSize }>
        </Puyo>
      </View>
    );
  }

  getStyle() {
    const { puyoSize } = this.props.layout;

    return {
      marginTop: 3,
      marginLeft: 3,
      width: puyoSize * fieldCols + contentsPadding * 2,
      height: puyoSize * 3 + contentsPadding * 2,
      backgroundColor: cardBackgroundColor,
      elevation: 2
    };
  }
}

