/**
 * Component for render history-tree node
 */
import React from 'react';
import { themeColor } from '../../utils/constants';
import { Path } from 'react-native-svg';
import _ from 'lodash';

type Props = {
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  isCurrentPath: boolean
};

export default class HistoryTreePath extends React.Component<Props, {}> {
  pathRound = 20;

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps, this.props);
  }

  render() {
    const { startX, startY, endX, endY, isCurrentPath } = this.props;
    const path = `M ${startX} ${startY} C ${startX} ${startY + this.pathRound} ${endX} ${endY - this.pathRound} ${endX} ${endY}`;
    return (
      <Path
        d={ path }
        stroke={ themeColor }
        strokeWidth={ 2 }
        strokeDasharray={ isCurrentPath ? 'none' : '4, 4' }
        fill="none"
      />
    );
  }
}