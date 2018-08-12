import React, { Component } from 'react';
import { View, ViewStyle } from 'react-native';
import { cardBackgroundColor, contentsPadding, fieldCols } from '../utils/constants';
import Puyo from './Puyo';
import { Layout } from "../selectors/layoutSelectors";
import { PendingPair } from "../selectors/simulatorSelectors";

export type Props = {
  pair: PendingPair,
  layout: Layout,
  puyoSkin: string,
  style?: ViewStyle
}

const padding = 3;

/**
 * Component for render pair
 */
export default class HandlingPuyos extends Component<Props, {}> {
  render() {
    const { pair, puyoSkin, layout, style } = this.props;
    const { puyoSize } = layout;

    return (
      <View style={ [this.getStyle(), style] }>
        <Puyo
          x={ pair[0].col * puyoSize + padding }
          y={ pair[0].row * puyoSize + padding }
          puyo={ pair[0].color }
          skin={ puyoSkin }
          size={ puyoSize }>
        </Puyo>
        <Puyo
          x={ pair[1].col * puyoSize + padding }
          y={ pair[1].row * puyoSize + padding }
          puyo={ pair[1].color }
          skin={ puyoSkin }
          size={ puyoSize }>
        </Puyo>
      </View>
    );
  }

  getStyle(): ViewStyle {
    const { puyoSize } = this.props.layout;

    return {
      padding: padding,
      width: puyoSize * fieldCols + padding * 2,
      height: puyoSize * 3 + padding * 2,
      backgroundColor: cardBackgroundColor,
      elevation: 2
    };
  }
}

