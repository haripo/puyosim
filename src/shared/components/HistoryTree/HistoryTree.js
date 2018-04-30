/**
 * Component for render history-tree
 */
import React from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding, themeLightColor, themeSemiColor } from '../../utils/constants';
import SvgPuyo from '../SvgPuyo';
import Svg, { G, Rect, } from 'react-native-svg';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import HistoryTreePath from './HistoryTreePath';
import HistoryTreeNode from './HistoryTreeNode';


export default class HistoryTree extends React.Component {

  // layout constants
  graphX = 100;
  graphY = 20;
  nodeWidth = 64;
  nodePaddingX = 70;
  nodePaddingY = 70;

  handsX = 20;
  handsY = 16;
  puyoSize = 32;

  constructor() {
    super();
    this.state = {
      baseX: 0,
      baseY: 0,
      swiping: false,
      lastPositionX: null,
      lastPositionY: null
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: ::this.handleResponderGrant,
      onPanResponderMove: ::this.handleResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: ::this.handleResponderRelease,
      onPanResponderTerminate: ::this.handleResponderTerminate,
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  handleNodePressed(historyIndex, e) {
    e.stopPropagation();
    this.props.onNodePressed(historyIndex);
  }

  handleResponderGrant(evt, gestureState) {
    this.setState({
      swiping: true,
      originalX: this.state.baseX,
      originalY: this.state.baseY
    });
  }

  handleResponderMove(evt, gestureState) {
    this.requestAnimationFrame(() => {
      if (this.state.swiping) {
        this.setState({
          baseX: this.state.originalX + gestureState.dx,
          baseY: this.state.originalY + gestureState.dy
        });
      }
    });
  }

  handleResponderRelease(evt, gestureState) {
    this.setState({
      swiping: false,
    });
  }

  handleResponderTerminate(evt, gestureState) {
    this.setState({
      swiping: false,
      baseX: this.state.originalX,
      baseY: this.state.originalY
    });
  }

  extractCurrentPath() {
    const { history, currentIndex } = this.props;
    let index = currentIndex;
    let result = {};
    while (index) {
      const p = history[index];
      result[p.prev] = index;
      index = p.prev;
    }
    return result;
  }

  renderHand(hand, row) {
    const x = this.handsX;
    const y = this.handsY;
    const padding = 10;
    const puyoSkin = 'puyoSkinDefault';
    return (
      <React.Fragment key={ row }>
        <Rect
          x={ x - padding }
          y={ y + this.nodePaddingY * row - padding }
          width={ this.puyoSize * 2 + padding * 2 }
          height={ this.puyoSize + padding * 2 }
          stroke={ 'none' }
          fill={ themeLightColor }
          rx="20"
          ry="20"/>
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[0] }
          x={ x }
          y={ y + this.nodePaddingY * row }
          skin={ puyoSkin }/>
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[1] }
          x={ x + this.puyoSize }
          y={ y + this.nodePaddingY * row }
          skin={ puyoSkin }/>
      </React.Fragment>
    );
  }

  renderHands(history) {
    // extract hands from history
    let hands = [];
    const searchHands = (index, depth) => {
      const record = history[index];
      if (depth > 0) {
        hands[depth - 1] = record.pair;
      }
      record.next.map(nextIndex => {
        searchHands(nextIndex, depth + 1);
      });
    };
    searchHands(0, 0);

    // render hands
    return hands.map((hand, i) => this.renderHand(hand, i))
  }

  renderNode(row, col, move, historyIndex) {
    if (move === null) {
      return null; // root node
    }
    const x = row * this.nodePaddingX + this.graphX;
    const y = col * this.nodePaddingY + this.graphY;
    const isCurrentNode = historyIndex === this.props.currentIndex;

    return (
      <HistoryTreeNode
        x={ x }
        y={ y }
        col={ move.col }
        rotation={ move.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ isCurrentNode }
        onPress={ e => this.handleNodePressed(historyIndex, e) }
      />
    );
  }

  renderPath(row1, row2, col1, col2, isCurrentPath) {
    const x1 = row1 * this.nodePaddingX + this.graphX + this.nodeWidth / 2;
    const y1 = col1 * this.nodePaddingY + this.graphY + this.nodeWidth / 2;
    const x2 = row2 * this.nodePaddingX + this.graphX + this.nodeWidth / 2;
    const y2 = col2 * this.nodePaddingY + this.graphY;
    return (
      <HistoryTreePath
        startX={ x1 }
        startY={ y1 }
        endX={ x2 }
        endY={ y2 }
        isCurrentPath={ isCurrentPath }
      />
    );
  }

  renderTree(history) {
    let width = 0;
    const currentPath = this.extractCurrentPath();
    const renderChildren = (historyIndex, depth, parentWidth) => {
      const record = history[historyIndex];
      if (!record) {
        return null;
      }

      return record.next.map((nextIndex, index) => {
        if (index > 0) {
          width += 1;
        }
        const isCurrentPath = currentPath[historyIndex] === nextIndex;
        return (
          <React.Fragment key={ index }>
            { historyIndex === 0 ? null : this.renderPath(parentWidth, width, depth - 1, depth, isCurrentPath) }
            { this.renderNode(width, depth, history[nextIndex].move, nextIndex) }
            { renderChildren(nextIndex, depth + 1, width) }
          </React.Fragment>
        );
      });
    };

    const { baseX, baseY } = this.state;
    return (
      <G transform={ `translate(${baseX}, ${baseY})` }>
        { renderChildren(0, 0) }
      </G>
    );
  }

  render() {
    return (
      <View
        style={ styles.component }
        { ...this._panResponder.panHandlers }
      >
        <Svg
          width={ this.props.width }
          height={ this.props.height }
        >
          { this.renderTree(this.props.history) }
          { this.renderHands(this.props.history) }
        </Svg>
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
    marginBottom: contentsPadding
  },
});


