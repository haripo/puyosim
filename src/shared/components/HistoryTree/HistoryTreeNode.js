/**
 * Component for render history-tree node
 */
import React from 'react';
import { isWeb, themeColor, themeLightColor } from '../../utils/constants';
import { G, Image, Rect, } from 'react-native-svg';
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

  constructor(props) {
    super(props);
    if (this.props.x.addListener) {
      this.props.x.addListener(value => {
        if (!this.g) return;
        const v = (1 - value.value) * (this.props.futureX - this.props.currentX) + this.props.currentX;
        this.g.setNativeProps({ matrix: [1, 0, 0, 1, v, 0] });
      });
    }
  }

  componentDidMount() {
    if (this.g && this.g.setNativeProps) {
      this.g.setNativeProps({ matrix: [1, 0, 0, 1, this.props.currentX, 0] });
    }
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
      <G { ...events } x={ x } ref={ ref => this.g = ref }>
        <Rect
          { ...events }
          x={ 0 }
          y={ y }
          width={ nodeWidth }
          height={ iconSize }
          stroke={ themeColor }
          strokeWidth={ isCurrentNode ? 4 : 2 }
          fill={ themeLightColor }
          rx="4"
          ry="4"/>
        <Image
          x={ iconPadding }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ numberImages[col] }
        />
        <Image
          x={ iconSize - iconPadding }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ arrowImages[rotation] }
        />
      </G>
    );
  }
}


