/**
 * Component for render next and double-next pairs
 */
import React, { PureComponent } from 'react';
import { View, ViewStyle } from 'react-native';
import Puyo from './Puyo';
import { Theme } from "../selectors/themeSelectors";
import { Layout } from "../selectors/layoutSelectors";
import { Pair } from "../../types";

export type Props = {
  next: Pair,
  doubleNext: Pair,

  numVisibleNext: string,
  leftyMode: string,

  puyoSkin: string,
  theme: Theme,
  layout: Layout,
}

const padding = 3;

export default class NextWindow extends PureComponent<Props, {}> {

  renderPair(pair) {
    const { puyoSize } = this.props.layout;
    const { puyoSkin } = this.props;

    const style: ViewStyle = {
      width: puyoSize + padding * 2,
      height: puyoSize * 2 + padding * 2,
      justifyContent: 'center',
      alignItems: 'center'
    };

    return (
      <View style={ style }>
        <Puyo
          puyo={ pair[1] }
          size={ puyoSize }
          skin={ puyoSkin }
          x={ padding }
          y={ padding }/>
        <Puyo
          puyo={ pair[0] }
          size={ puyoSize }
          skin={ puyoSkin }
          x={ padding }
          y={ padding + puyoSize }/>
      </View>
    );
  }

  render() {
    const { next, doubleNext, numVisibleNext, leftyMode, theme } = this.props;
    const style: ViewStyle = {
      flexDirection: leftyMode === 'on' ? 'row-reverse' : 'row',
      backgroundColor: theme.cardBackgroundColor,
      elevation: 2
    };

    return (
      <View style={ style }>
        { this.renderPair(next) }
        { numVisibleNext !== 'visibleNextOnly' ? this.renderPair(doubleNext) : null }
      </View>
    );
  }
}