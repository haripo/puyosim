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

export default class SlimHistoryTree extends React.Component<Props, State> {

  // layout constants
  handsX = 8;
  handsY = 14;

  nodeWidth = (sideWidth - this.handsY * 2) / 3;
  nodeHeight = this.nodeWidth / 2;
  puyoMarginY = 0;
  pathRound = 30;

  nodeMarginTop = 1;
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

  renderMainNode(node: HistoryRecord) {
    const { move } = node;

    return (
      <HistoryTreeNode
        x={ this.nodeMarginLeft }
        y={ this.nodeMarginTop }
        col={ move!.col }
        rotation={ move!.rotation }
        nodeWidth={ this.nodeWidth }
        isCurrentNode={ false }
        //       onPress={ e => this.handleNodePressed(historyIndex, e) }
      />
    );
  }

  renderSubNode(node: HistoryRecord, index: number) {
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
        //       onPress={ e => this.handleNodePressed(historyIndex, e) }
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

  renderItem({ index, item }: { index: number, item: HistoryRecord }) {
    if (item.move === null) {
      return;
    }
    const children = item.next
      .filter(i => i !== item.defaultNext)
      .map(i => this.props.history[i])
      .map((record, i) =>
        <Fragment key={ i }>
          { this.renderSubNode(record, i) }
          { this.renderSubPath(i) }
        </Fragment>
      );
    const hasNext = item.defaultNext !== null;
    const svgHeight = (this.nodeHeight + this.nodeMarginBottom) * (1 + children.length);
    return (
      <Svg width={ 300 } height={ svgHeight }>
        { this.renderPair(item.pair, index) }
        { this.renderMainNode(item) }
        { hasNext ? this.renderMainPath(svgHeight) : null }
        { children }
      </Svg>
    )
  }

  render() {
    const { history } = this.props;

    // flatten history
    let flatHist: HistoryRecord[] = [];
    let next: number | null = 0;
    while (next !== null) {
      const record = history[next];
      flatHist.push(record);
      next = record.defaultNext;
    }

    return (
      <View
        style={ styles.component }
      >
        <FlatList
          data={ flatHist }
          renderItem={ this.renderItem.bind(this) }
        />
      </View>
    );
  }
};

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
