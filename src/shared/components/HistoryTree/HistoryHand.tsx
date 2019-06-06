import React from 'react';
import Puyo from "../Puyo";
import { Pair } from "../../../types";

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
        <Puyo
          size={ puyoSize }
          puyo={ hand[0] }
          x={ x }
          y={ y }
          skin={ puyoSkin }/>
        <Puyo
          size={ puyoSize }
          puyo={ hand[1] }
          x={ x + puyoSize }
          y={ y }
          skin={ puyoSkin }/>
      </React.Fragment>
    );
  }
}