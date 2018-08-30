import React from 'react';
import SvgPuyo from '../SvgPuyo';
import { Pair } from "../../models/stack";

export type Props = {
  hand: Pair,
  puyoSize: number,
  puyoSkin: string,
  x: number,
  y: number
};

export default class HistoryHand extends React.Component<Props, {}> {
  render() {
    const { x, y, hand, puyoSize, puyoSkin } = this.props;

    return (
      <React.Fragment>
        <SvgPuyo
          size={ puyoSize }
          puyo={ hand[0] }
          x={ x }
          y={ y }
          skin={ puyoSkin }/>
        <SvgPuyo
          size={ puyoSize }
          puyo={ hand[1] }
          x={ x + puyoSize }
          y={ y }
          skin={ puyoSkin }/>
      </React.Fragment>
    );
  }
}