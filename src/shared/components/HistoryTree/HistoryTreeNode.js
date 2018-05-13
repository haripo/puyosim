/**
 * Component for render history-tree node
 */
import React from 'react';
import { isWeb, themeColor, themeLightColor } from '../../utils/constants';
import { G, Image, Rect, } from 'react-native-svg';
import _ from 'lodash';
import compareWith from '../../utils/compareWith';

const arrowImages = {
  top: require('../../../../assets/history_tree/arrow-top.png'),
  bottom: require('../../../../assets/history_tree/arrow-bottom.png'),
  left: require('../../../../assets/history_tree/arrow-left.png'),
  right: require('../../../../assets/history_tree/arrow-right.png')
};

const numberImages = [
  require('../../../../assets/history_tree/number1.png'),
  require('../../../../assets/history_tree/number2.png'),
  require('../../../../assets/history_tree/number3.png'),
  require('../../../../assets/history_tree/number4.png'),
  require('../../../../assets/history_tree/number5.png'),
  require('../../../../assets/history_tree/number6.png')
];

export default class HistoryTreeNode extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !compareWith(
      this.props,
      nextProps,
      'x',
      'y',
      'col',
      'rotation',
      'nodeWidth',
      'isCurrentNode');
  }

  render() {
    const { x, y, col, rotation, nodeWidth, isCurrentNode, onPress } = this.props;
    const iconSize = nodeWidth / 2;
    const iconPadding = nodeWidth / 16;

    // Android では G 要素の onPress がとれなかったので、
    // onClick のみでよさそう
    const eventName = isWeb ? 'onClick' : 'onPress';
    const events = {
      [eventName]: e => onPress(e)
    };

    return (
      <G { ...events }>
        <Rect
          onPress={ onPress }
          x={ x }
          y={ y }
          width={ nodeWidth }
          height={ iconSize }
          stroke={ themeColor }
          strokeWidth={ isCurrentNode ? 4 : 2 }
          fill={ themeLightColor }
          rx="4"
          ry="4"/>
        <Image
          x={ x + iconPadding }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ numberImages[col] }
        />
        <Image
          x={ x + iconSize - iconPadding }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ arrowImages[rotation] }
        />
      </G>
    );
  }
}


