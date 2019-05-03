/**
 * Component for render history-tree node
 */
import React  from 'react';
import { themeColor, themeLightColor } from '../../utils/constants';
import compareWith from '../../utils/compareWith';
import { Animated, Image, View } from "react-native";
import { Rotation } from "../../models/move";
import Icon from "react-native-vector-icons/MaterialIcons";

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

export type Props = {
  x: Animated.AnimatedValue | Animated.AnimatedInterpolation | number,
  y: number,
  type?: undefined | 'edit',
  col?: number,
  rotation?: Rotation,
  nodeWidth: number,
  isCurrentNode: boolean,
  onPress?: (e: any) => void
}

/**
 * HistoryTreeNode which does not use svg elements
 */
export default class HistoryTreeNodeV2 extends React.Component<Props, {}> {
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

  renderFrame(x, y, nodeWidth, isCurrentNode, iconSize) {
    return (
      <View
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          width: nodeWidth,
          height: iconSize,
          borderWidth: isCurrentNode ? 4 : 2,
          borderColor: themeColor,
          borderRadius: 4,
          backgroundColor: themeLightColor
        }}
      />
    );
  }

  renderText(col, rotation, x, y, nodeWidth, iconSize) {
    const iconPadding = nodeWidth / 16;

    if (this.props.type === 'edit') {
      return (
        <View>
          <Icon
            name='edit'
            color={ 'black' }
            size={ iconSize - 4 }
            style={{
              position: 'absolute',
              left: iconPadding + iconSize / 2,
              top: y + 1,
              width: iconSize,
              height: iconSize
            }}
          />
        </View>
      );
    }

    if (!col && !rotation) {
      // root node 用に col, rotation を表示しないパターンが必要
      return null;
    }

    return (
      <View>
        <Image
          style={{
            position: 'absolute',
            left: iconPadding,
            top: y,
            width: iconSize,
            height: iconSize
          }}
          source={ numberImages[col] }
        />
        <Image
          style={{
            position: 'absolute',
            left: iconSize - iconPadding,
            top: y,
            width: iconSize,
            height: iconSize
          }}
          source={ arrowImages[rotation] }
        />
      </View>
    );
  }

  render() {
    const { x, y, col, rotation, nodeWidth, isCurrentNode, onPress } = this.props;
    const iconSize = nodeWidth / 2;

    return (
      <Animated.View onTouchEnd={ onPress } style={{ translateX: x }}>
        { this.renderFrame(x, y, nodeWidth, isCurrentNode, iconSize) }
        { this.renderText(col, rotation, x, y, nodeWidth, iconSize) }
      </Animated.View>
    );
  }
}


