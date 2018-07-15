/**
 * Small component for render history-tree
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text } from 'react-native';
import {
  cardBackgroundColor,
  contentsPadding,
  screenHeight,
  screenWidth, themeColor,
  themeLightColor,
} from '../../utils/constants';
import SvgPuyo from '../SvgPuyo';
import Svg, { G, Path, Rect, } from 'react-native-svg';
import HistoryTreeNode from './HistoryTreeNode';
import { HistoryRecord } from "../../models/history";
import { sideWidth } from '../../utils/constants';

export interface Props {
  history: HistoryRecord[],
  currentIndex: number,
  onNodePressed: Function
}

interface State {
}

type RecordIndexPair = { record: HistoryRecord, historyIndex: number };

export default class SlimHistoryTree extends React.Component<Props, State> {

  // layout constants
  handsX = 8;
  handsY = 14;

  nodeWidth = (sideWidth - this.handsY * 2) / 3;
  nodeHeight = this.nodeWidth / 2;
  puyoMarginY = 0;
  pathRound = 30;

  nodeMarginTop = 2;
  nodeMarginLeft = (sideWidth - this.handsX) / 3 + this.handsX;
  nodeMarginBottom = 20;

  childrenLeft = this.nodeWidth;

  puyoSize = (this.nodeMarginLeft - this.handsX) / 2 - 5;

  handleNodePressed(historyIndex, e) {
    e.stopPropagation();
    this.props.onNodePressed(historyIndex);
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
          connections={ null }
          a={ 1 }
        />
        <SvgPuyo
          size={ this.puyoSize }
          puyo={ hand[1] }
          x={ x + this.puyoSize }
          y={ this.puyoMarginY }
          skin={ puyoSkin }
          connections={ null }
          a={ 1 }
        />
      </React.Fragment>
    );
  }

  renderMainNode(node: HistoryRecord, index: number, isCurrentNode: boolean) {
    const { move } = node;

    return (
      <HistoryTreeNode
        x={ this.nodeMarginLeft }
        y={ this.nodeMarginTop }
        col={ move!.col }
        rotation={ move!.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ isCurrentNode }
        onPress={ e => this.handleNodePressed(index, e) }
      />
    );
  }

  renderSubNode(historyIndex: number, index: number) {
    const node = this.props.history[historyIndex];
    const { move } = node;

    return (
      <HistoryTreeNode
        x={ this.childrenLeft + this.nodeMarginLeft }
        y={ (index + 1) * (this.nodeHeight + this.nodeMarginBottom) }
        col={ move!.col }
        rotation={ move!.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ false }
        key={ index }
        onPress={ e => this.handleNodePressed(historyIndex, e) }
      />
    );
  }
  renderMainPath(svgHeight: number) {
    const startX = this.nodeWidth / 2 + this.nodeMarginLeft;
    const startY = this.nodeHeight + this.nodeMarginTop;
    const endX = this.nodeWidth / 2 + this.nodeMarginLeft;
    const endY = svgHeight + this.nodeMarginTop;
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

  renderSubPath(index: number) {
    const y = (index + 1) * (this.nodeHeight + this.nodeMarginBottom) +
      this.nodeHeight / 2 + this.nodeMarginTop;
    const startX = this.nodeWidth / 2 + this.nodeMarginLeft;
    const endX = this.childrenLeft + this.nodeMarginLeft;
    const path = `M ${startX} ${y - this.pathRound} C ${startX} ${y} ${endX} ${y} ${endX} ${y}`;
    return (
      <Path
        d={ path }
        stroke={ themeColor }
        strokeWidth={ 2 }
        strokeDasharray={ '4, 4' }
        fill="none"
      />
    );
  }

  renderItem({ itemIndex, item }: { itemIndex: number, item: RecordIndexPair }) {
    if (item.record.move === null) {
      return;
    }
    const children = item.record.next
      .filter(i => i !== item.record.defaultNext)
      .map((historyIndex, i) =>
        <Fragment key={ i }>
          { this.renderSubNode(historyIndex, i) }
          { this.renderSubPath(i) }
        </Fragment>
      );
    const hasNext = item.record.defaultNext !== null;
    const svgHeight = (this.nodeHeight + this.nodeMarginBottom) * (1 + children.length);
    return (
      <Svg width={ 300 } height={ svgHeight }>
        { this.renderPair(item.record.pair, itemIndex) }
        { this.renderMainNode(item.record, item.historyIndex, item.historyIndex === this.props.currentIndex) }
        { hasNext ? this.renderMainPath(svgHeight) : null }
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
      <View
        style={ styles.component }
      >
        <FlatList
          data={ flatHist }
          renderItem={ this.renderItem.bind(this) }
          keyExtractor={ (record, index) => String(index) }
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
    height: screenHeight - contentsPadding * 4,
    width: screenWidth - contentsPadding * 2
  },
});
