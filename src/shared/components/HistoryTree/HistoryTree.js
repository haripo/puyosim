/**
 * Component for render history-tree
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cardBackgroundColor, contentsPadding, screenHeight, screenWidth,
  themeLightColor,
} from '../../utils/constants';
import SvgPuyo from '../SvgPuyo';
import Svg, { G, Rect, } from 'react-native-svg';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import HistoryTreePath from './HistoryTreePath';
import HistoryTreeNode from './HistoryTreeNode';

export default class HistoryTree extends React.Component {

  // layout constants
  graphX = 95;
  graphY = 20;
  nodeWidth = 48;
  handWidth = 80;
  nodePaddingX = 64;
  nodePaddingY = 48;

  handsX = 20;
  handsY = 16;
  puyoSize = 24;

  constructor() {
    super();
    this.state = {
      top: 0,
      left: 0
    }
  }

  handleNodePressed(historyIndex, e) {
    e.stopPropagation();
    this.props.onNodePressed(historyIndex);
  }

  renderHand(hand, row) {
    const x = this.handsX;
    const y = this.handsY;
    const puyoSkin = 'puyoSkinDefault';

    return (
      <React.Fragment key={ row }>
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[0] }
          x={ x }
          y={ y + this.nodePaddingY * row + 2 }
          skin={ puyoSkin }/>
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[1] }
          x={ x + this.puyoSize }
          y={ y + this.nodePaddingY * row + 2 }
          skin={ puyoSkin }/>
      </React.Fragment>
    );
  }

  renderNode(node) {
    const { row, col, move, historyIndex, isCurrentNode } = node;

    if (move === null) {
      return null; // root node
    }

    const x = row * this.nodePaddingX + this.graphX;
    const y = col * this.nodePaddingY + this.graphY;

    return (
      <HistoryTreeNode
        x={ x }
        y={ y }
        col={ move.col }
        rotation={ move.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ isCurrentNode }
        key={ `${row}-${col}-${historyIndex}` }
        onPress={ e => this.handleNodePressed(historyIndex, e) }
      />
    );
  }

  renderPath(path) {
    const { from, to, isCurrentPath } = path;
    const x1 = from.row * this.nodePaddingX + this.graphX + this.nodeWidth / 2;
    const y1 = from.col * this.nodePaddingY + this.graphY + this.nodeWidth / 2;
    const x2 = to.row * this.nodePaddingX + this.graphX + this.nodeWidth / 2;
    const y2 = to.col * this.nodePaddingY + this.graphY;

    return (
      <HistoryTreePath
        key={ `${from.row}-${from.col}-${to.row}-${to.col}` }
        startX={ x1 }
        startY={ y1 }
        endX={ x2 }
        endY={ y2 }
        isCurrentPath={ isCurrentPath }
      />
    );
  }

  renderTree(nodes, paths) {
    return (
      <G>
        { nodes.map(node => this.renderNode(node)) }
        { paths.map(path => this.renderPath(path)) }
      </G>
    );
  }

  render() {
    const { nodes, paths, hands, width, height } = this.props.historyTreeLayout;

    const svgWidth = (width + 1) * this.nodePaddingX + this.graphX;
    const svgHeight = (height + 1) * this.nodePaddingY + this.graphY;

    return (
      <View
        style={ styles.component }
      >
        { /*<!--
          SVG elements has "overflow: hidden" implicitly.
          To ignore this, wrap Svg by View and specifying its size.
        */ }
        <View width={ svgWidth } height={ svgHeight }>
          <Svg width={ svgWidth } height={ svgHeight }>
            { this.renderTree(nodes, paths) }
          </Svg>
        </View>
        <View style={ styles.handView } height={ svgHeight }>
          <Svg width={ this.handWidth } height={ svgHeight }>
            <Rect
              x={ 0 }
              y={ 0 }
              width={ this.handWidth }
              height={ svgHeight }
              fill={ themeLightColor }
            />
            { hands.map((hand, i) => this.renderHand(hand, i)) }
          </Svg>
        </View>
      </View>
    );
  }
}

reactMixin(HistoryTree.prototype, TimerMixin);

const styles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: cardBackgroundColor,
    marginTop: contentsPadding,
    marginRight: contentsPadding,
    marginBottom: contentsPadding,
    overflow: 'scroll',
    height: screenHeight - contentsPadding * 4,
    width: screenWidth - contentsPadding * 2
  },
  treeView: {
    position: 'absolute'
  },
  handView: {
    position: 'absolute',
    borderColor: '#D1CDCB',
    borderRightWidth: 2
  }
});
