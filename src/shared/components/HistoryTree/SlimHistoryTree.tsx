/**
 * Small component for render history-tree
 */
import React, { Fragment } from 'react';
import { ActivityIndicator, Animated, FlatList, Platform, StyleSheet, View } from 'react-native';
import {
  cardBackgroundColor,
  isWeb,
  themeColor,
  themeLightColor,
} from '../../utils/constants';
import SvgPuyo from '../SvgPuyo';
import Svg, { G, Path, Rect, } from 'react-native-svg';
import HistoryTreeNode from './HistoryTreeNode';
import { HistoryRecord } from "../../models/history";
import HistoryHand from "./HistoryHand";

export interface Props {
  history: HistoryRecord[],
  currentIndex: number,
  onNodePressed: Function
}

interface State {
  nodeAnimated: Animated.AnimatedValue[],
  width: number,
  height: number
}

type RecordIndexPair = { record: HistoryRecord, historyIndex: number };

export default class SlimHistoryTree extends React.Component<Props, State> {

  // layout constants
  handsX = 8;
  handsY = 14;

  view: View | null = null;

  get nodeWidth() {
    return (this.state.width - this.handsY * 2) / 3
  }

  get nodeHeight() {
    return this.nodeWidth / 2
  }

  puyoMarginY = 10;
  nodeMarginTop = 10;

  get nodeMarginLeft() {
    return (this.state.width - this.handsX) / 3 + this.handsX
  }

  nodeMarginBottom = 10;

  get childrenLeft() {
    return this.nodeWidth
  }

  get puyoSize() {
    return (this.nodeMarginLeft - this.handsX) / 2 - 5
  }

  constructor(props) {
    super(props);

    const { history } = this.props;

    this.state = {
      nodeAnimated: history.map(() => new Animated.Value(1)),
      width: 0,
      height: 0
    };
  }

  /**
   * History の現在のパスのみを取得します
   */
  get flattenedHistory(): RecordIndexPair[] {
    const { history } = this.props;
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
    return flatHist;
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
      <HistoryHand
        key={ index }
        hand={ hand }
        x={ x }
        y={ this.puyoMarginY }
        puyoSkin={ puyoSkin }
        puyoSize={ this.puyoSize }
      />
    );
  }

  renderNode(historyIndex: number, index: number, isMainPath: boolean) {
    const node = this.props.history[historyIndex];
    const isCurrentNode = historyIndex === this.props.currentIndex;

    if (node.type === 'head') {
      return (
        <HistoryTreeNode
          x={ this.nodeMarginLeft }
          y={ this.nodeMarginTop }
          nodeWidth={ this.nodeWidth }
          isCurrentNode={ isCurrentNode }
        />
      );
    }

    return (
      <HistoryTreeNode
        x={ this.state.nodeAnimated[historyIndex] }
        y={ index * (this.nodeHeight + this.nodeMarginBottom + this.nodeMarginTop) + this.nodeMarginTop }
        currentX={ this.nodeMarginLeft + (isMainPath ? 0 : this.childrenLeft) }
        futureX={ this.nodeMarginLeft + (isMainPath ? this.childrenLeft : 0) }
        col={ node.move.col }
        rotation={ node.move.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ isCurrentNode }
      />
    );
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

  renderRow(item, historyIndex, i) {
    const height = this.nodeMarginTop + this.nodeHeight + this.nodeMarginBottom;
    const events = {
      [isWeb ? 'onClick' : 'onPressOut']: e => this.handleNodePressed(historyIndex, e)
    };
    return (
      <Fragment key={ historyIndex }>
        { this.renderNode(historyIndex, i, item.historyIndex === historyIndex) }
        {/* touchable area */}
        <Rect
          x={ 0 }
          y={ height * i }
          width={ this.state.width }
          height={ height }
          fill={ 'transparent' }
          key={ i }
          { ...events }
        />
      </Fragment>
    );
  }

  renderItem({ index, item }: { index: number, item: RecordIndexPair }) {
    const hasNext = item.record.defaultNext !== null;
    const hasPrev = item.record.prev !== null;
    const indices = item.record.prev !== null ? this.props.history[item.record.prev].next : [item.historyIndex];
    const color = index % 2 === 0 ? themeLightColor : themeColor;
    const height = this.nodeMarginTop + this.nodeHeight + this.nodeMarginBottom;
    const svgHeight = height * indices.length;
    return (
      <Svg width={ this.state.width } height={ svgHeight }>
        <Rect
          x={ 0 }
          y={ 0 }
          width={ this.state.width }
          height={ svgHeight }
          fill={ color }
          fillOpacity={ 0.2 }
        />
         { item.record.type !== 'head' ? this.renderPair(item.record.pair, index) : null }
        { this.renderMainPath(svgHeight, hasNext, hasPrev) }
        { indices.map((historyIndex, i) => this.renderRow(item, historyIndex, i)) }
      </Svg>
    )
  }

  renderActivityIndicator() {
    return (
      <View
        style={ styles.component }
        onLayout={ this.handleLayout.bind(this) }
        ref={ ref => this.view = ref }>
        <ActivityIndicator/>
      </View>
    );
  }

  render() {
    if (this.state.width === 0) {
      return this.renderActivityIndicator();
    }

    return (
      <View style={ styles.component }>
        <FlatList
          data={ this.flattenedHistory }
          renderItem={ this.renderItem.bind(this) }
          keyExtractor={ record => String(record.historyIndex) }
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
    overflow: 'scroll'
  }
});
