/**
 * Small component for render history-tree
 */
import React, { Fragment } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import {
  cardBackgroundColor,
  contentsPadding,
  isWeb,
  screenHeight,
  screenWidth,
  themeColor,
  themeLightColor,
} from '../../utils/constants';
import SvgPuyo from '../SvgPuyo';
import Svg, { G, Path, Rect, } from 'react-native-svg';
import HistoryTreeNode from './HistoryTreeNode';
import { HistoryRecord } from "../../models/history";
import AnimatedValue = Animated.AnimatedValue;

export interface Props {
  history: HistoryRecord[],
  currentIndex: number,
  onNodePressed: Function
}

interface State {
  nodeAnimated: AnimatedValue[],
  width: number,
  height: number
}

type RecordIndexPair = { record: HistoryRecord, historyIndex: number };

export default class SlimHistoryTree extends React.Component<Props, State> {

  // layout constants
  handsX = 8;
  handsY = 14;

  view: View | null = null;

  get nodeWidth() { return (this.state.width - this.handsY * 2) / 3 }
  get nodeHeight() { return this.nodeWidth / 2 }
  puyoMarginY = 10;
  nodeMarginTop = 10;
  get nodeMarginLeft() { return (this.state.width - this.handsX) / 3 + this.handsX }
  nodeMarginBottom = 10;

  get childrenLeft() { return this.nodeWidth }
  get puyoSize() { return (this.nodeMarginLeft - this.handsX) / 2 - 5 }

  constructor(props) {
    super(props);

    const { history } = this.props;

    const l = history.length;
    let r: AnimatedValue[] = [];
    for (let i = 0; i < l; i++) {
      r[i] = new Animated.Value(1);
    }
    this.state = {
      nodeAnimated: r,
      width: 0,
      height: 0
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
    const { history, currentIndex } = this.props;
    const { history: prevHistory, currentIndex: prevCurrentIndex } = prevProps;
    const isMainPath = (history, i) => history[history[i].prev].defaultNext === i;

    for (let i = 0; i < history.length; i++) {
      this.state.nodeAnimated[currentIndex].setValue(1);
    }

    for (let i = 1; i < history.length; i++) {
      if (isMainPath(history, i) !== isMainPath(prevHistory, i)) {
        this.state.nodeAnimated[i].setValue(0);
        Animated.timing(this.state.nodeAnimated[i], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        }).start();
      }
    }
  }

  handleNodePressed(historyIndex: number, e) {
    e.stopPropagation();
    this.props.onNodePressed(historyIndex);
  }

  handleLayout(e) {
    this.view!.measure((ox, oy, width, height) => {
      this.setState({ width, height });
    });
  }

  renderPair(hand, index) {
    const x = this.handsX;
    const puyoSkin = 'puyoSkinDefault';

    return (
      <React.Fragment key={ index }>
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[0] }
          x={ x }
          y={ this.puyoMarginY }
          skin={ puyoSkin }
          a={ 1 }
        />
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[1] }
          x={ x + this.puyoSize }
          y={ this.puyoMarginY }
          skin={ puyoSkin }
          a={ 1 }
        />
      </React.Fragment>
    );
  }

  renderRootNode(isCurrentNode: boolean) {
    const eventName = isWeb ? 'onClick' : 'onPress';
    const events = {
      [eventName]: e => this.handleNodePressed(0, e)
    };

    return (
      <G { ...events } >
        <Rect
          { ...events }
          x={ this.nodeMarginLeft }
          y={ this.nodeMarginTop }
          width={ this.nodeWidth }
          height={ this.nodeHeight }
          stroke={ themeColor }
          strokeWidth={ isCurrentNode ? 4 : 2 }
          fill={ themeLightColor }
          rx="4"
          ry="4"/>
      </G>
    );
  }

  renderSubNode(historyIndex: number, index: number, isMainPath: boolean) {
    const node = this.props.history[historyIndex];
    const isCurrentNode = historyIndex === this.props.currentIndex;
    const { move } = node;

    if (isMainPath) {
      return (
        <HistoryTreeNode
          x={ this.state.nodeAnimated[historyIndex] }
          y={ index * (this.nodeHeight + this.nodeMarginBottom + this.nodeMarginTop) + this.nodeMarginTop }
          currentX={ this.nodeMarginLeft }
          futureX={ this.nodeMarginLeft + this.childrenLeft }
          col={ move!.col }
          rotation={ move!.rotation }
          nodeWidth={ this.nodeWidth }
          isCurrentNode={ isCurrentNode }
          onPress={ e => this.handleNodePressed(historyIndex, e) }
        />
      );
    } else {
      return (
        <HistoryTreeNode
          x={ this.state.nodeAnimated[historyIndex] }
          y={ index * (this.nodeHeight + this.nodeMarginBottom + this.nodeMarginTop) + this.nodeMarginTop }
          currentX={ this.nodeMarginLeft + this.childrenLeft }
          futureX={ this.nodeMarginLeft }
          col={ move!.col }
          rotation={ move!.rotation }
          nodeWidth={ this.nodeWidth }
          isCurrentNode={ false }
          key={ index }
          onPress={ e => this.handleNodePressed(historyIndex, e) }
        />
      );
    }
  }

  renderMainPath(svgHeight: number, hasNext: boolean, hasPrev: boolean) {
    const startX = this.nodeWidth / 2 + this.nodeMarginLeft;
    const startY = hasPrev ? -1 : this.nodeHeight / 2;
    const endX = this.nodeWidth / 2 + this.nodeMarginLeft;
    const endY = hasNext ? svgHeight + 1 : this.nodeHeight / 2;
    const path = `M ${startX} ${startY} C ${startX} ${startY} ${endX} ${endY} ${endX} ${endY}`;
    return (
      <Path
        d={ path }
        stroke={ themeColor }
        strokeWidth={ 2 }
        fill="none"
      />
    );
  }

  renderItem({ index, item }: { index: number, item: RecordIndexPair }) {
    const hasNext = item.record.defaultNext !== null;
    const hasPrev = item.record.prev !== null;
    const isCurrentNode = item.historyIndex === this.props.currentIndex;

    if (item.record.move === null) {
      // root node
      const svgHeight = this.nodeMarginTop + this.nodeHeight + this.nodeMarginBottom;
      return (
        <Svg width={ 300 } height={ svgHeight }>
          { this.renderMainPath(svgHeight, true, false) }
          { this.renderRootNode(isCurrentNode) }
        </Svg>
      );
    }

    const indices = item.record.prev ? this.props.history[item.record.prev].next : [item.historyIndex];
    const children = indices
      .map((historyIndex, i) =>
        <Fragment key={ historyIndex }>
          { this.renderSubNode(historyIndex, i, item.historyIndex === historyIndex) }
        </Fragment>
      );
    const svgHeight = (this.nodeMarginTop + this.nodeHeight + this.nodeMarginBottom) * children.length;
    const color = index % 2 === 0 ? themeLightColor : themeColor;
    return (
      <Svg width={ 300 } height={ svgHeight }>
        <Rect
          x={ 0 }
          y={ 0 }
          width={ 300 }
          height={ svgHeight }
          fill={ color }
          fillOpacity={ 0.2 }
        />
        { this.renderPair(item.record.pair, index) }
        { this.renderMainPath(svgHeight, hasNext, hasPrev) }
        { children }
      </Svg>
    )
  }

  render() {
    const { history } = this.props;

    // flatten history
    let flatHist: RecordIndexPair[] = [];
    let next: number | null = 0;
    while (next !== null) {
      const record = history[next];
      flatHist.push({
        record,
        historyIndex: next
      });
      next = record.defaultNext;
    }

    return (
      <View style={ styles.component }
            onLayout={ this.handleLayout.bind(this) }
            ref={ ref => this.view = ref }>
        <FlatList
          data={ flatHist }
          renderItem={ this.renderItem.bind(this) }
          keyExtractor={ (record, index) => String(record.historyIndex) }
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  component: {
    flex: 1,
    elevation: 2,
    backgroundColor: cardBackgroundColor,
    overflow: 'scroll',
    // height: screenHeight - contentsPadding * 4,
    // width: screenWidth - contentsPadding * 2
  }
});
