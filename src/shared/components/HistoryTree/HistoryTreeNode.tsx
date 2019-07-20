/**
 * Component for render history-tree node
 */
import React from 'react';
import { themeColor, themeLightColor } from '../../utils/constants';
import { G, Image, Rect, } from 'react-native-svg';
import compareWith from '../../utils/compareWith';
import { Animated, Platform } from "react-native";
import { Rotation } from "../../../types";

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
  x: Animated.AnimatedValue | number,
  y: number,
  futureX?: number,
  currentX?: number,
  col?: number,
  rotation?: Rotation,
  nodeWidth: number,
  isCurrentNode: boolean,
  onPress?: (e: any) => void
}

const isAnimatedValue = (value: any): value is Animated.AnimatedValue => !!value.addListener;

export default class HistoryTreeNode extends React.Component<Props, {}> {
  g: any;

  constructor(props) {
    super(props);
    if (isAnimatedValue(this.props.x)) {
      this.props.x.addListener(value => {
        if (!this.g) return;
        const v = (1 - value.value) * (this.props.futureX! - this.props.currentX!) + this.props.currentX!;
        this.g.setNativeProps({ matrix: [1, 0, 0, 1, v, 0] });
      });
    }
  }

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

  componentDidMount() {
    if (this.g && this.g.setNativeProps) {
      this.g.setNativeProps({ matrix: [1, 0, 0, 1, this.props.currentX || 0, 0] });
    }
  }

  renderFrame(x, y, nodeWidth, isCurrentNode, iconSize, events) {
    return (
      <Rect
        { ...events }
        x={ x }
        y={ y }
        width={ nodeWidth }
        height={ iconSize }
        stroke={ themeColor }
        strokeWidth={ isCurrentNode ? 4 : 2 }
        fill={ themeLightColor }
        rx="4"
        ry="4"/>
    );
  }

  renderText(col, rotation, x, y, nodeWidth, iconSize) {
    const iconPadding = nodeWidth / 16;

    if (!col && !rotation) {
      // root node 用に col, rotation を表示しないパターンが必要
      return null;
    }

    return (
      <React.Fragment>
        <Image
          x={ iconPadding + x }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ numberImages[col] }
        />
        <Image
          x={ iconSize - iconPadding + x }
          y={ y }
          width={ iconSize }
          height={ iconSize }
          href={ arrowImages[rotation] }
        />
      </React.Fragment>
    );
  }

  render() {
    const { y, col, rotation, nodeWidth, isCurrentNode, onPress } = this.props;
    const iconSize = nodeWidth / 2;

    // Android では G 要素の onPress がとれなかったので、
    // onClick のみでよさそう
    const eventName = Platform.OS === 'web' ? 'onClick' : 'onPress';
    const events = {
      [eventName]: e => (onPress ? onPress(e) : null)
    };

    let x = isAnimatedValue(this.props.x) ? 0 : this.props.x;

    if (Platform.OS === 'web') {
      return (
        <G { ...events }>
          { this.renderFrame(x, y, nodeWidth, isCurrentNode, iconSize, events) }
          { this.renderText(col, rotation, x, y, nodeWidth, iconSize) }
        </G>
      );
    }
    return (
      <G { ...events } ref={ ref => this.g = ref }>
        { this.renderFrame(x, y, nodeWidth, isCurrentNode, iconSize, events) }
        { this.renderText(col, rotation, x, y, nodeWidth, iconSize) }
      </G>
    );
  }
}


