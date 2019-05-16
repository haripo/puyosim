/**
 * Small component for render history-tree
 */
import _ from 'lodash';
import React from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import { cardBackgroundColor, themeColor, } from '../../utils/constants';
import { HistoryRecord } from "../../models/history";
import HistoryHand from "./HistoryHand";
import HistoryTreeNodeV2 from "./HistoryTreeNodeV2";

export interface Props {
  history: HistoryRecord[],
  currentIndex: number,
  onNodePressed: Function,
  style: ViewStyle
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
    return this.nodeWidth + 10
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
   *
   * TODO: selector に移動する
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

  renderNode(historyIndex: number | null, isMainPath: boolean) {
    if (historyIndex === null) return;

    const node = this.props.history[historyIndex];
    const isCurrentNode = historyIndex === this.props.currentIndex;

    const animX = this.state.nodeAnimated[historyIndex].interpolate({
      inputRange: [0, 1],
      outputRange: [
        this.nodeMarginLeft + (isMainPath ? this.childrenLeft : 0),
        this.nodeMarginLeft + (isMainPath ? 0 : this.childrenLeft),
      ]
    });

    switch (node.type) {
      case 'head':
        return (
          <HistoryTreeNodeV2
            x={ this.nodeMarginLeft }
            y={ this.nodeMarginTop }
            nodeWidth={ this.nodeWidth }
            isCurrentNode={ isCurrentNode }
          />
        );
      case 'edit':
        return (
          <HistoryTreeNodeV2
            type='edit'
            x={ animX }
            y={ this.nodeMarginTop }
            nodeWidth={ this.nodeWidth }
            isCurrentNode={ isCurrentNode }
          />
        );
      default:
        return (
          <HistoryTreeNodeV2
            x={ animX }
            y={ this.nodeMarginTop }
            col={ node.move.col }
            rotation={ node.move.rotation }
            nodeWidth={ this.nodeWidth }
            isCurrentNode={ isCurrentNode }
          />
        );
    }
  }

  renderMainPath(svgHeight: number, hasNext: boolean, hasPrev: boolean) {
    return (
      <View
        style={{
          position: 'absolute',
          left: this.nodeWidth / 2 + this.nodeMarginLeft,
          top: hasPrev ? -1 : this.nodeHeight / 2,
          width: 1,
          height: hasNext ? svgHeight : svgHeight / 2,
          borderColor: themeColor,
          borderWidth: 1,
        }}
      />
    );
  }

  renderTouchableAreas(mainItemIndex: number | null, subItemIndex: number | null) {
    const renderView = (itemIndex: number | null, key: number, style: ViewStyle) => {
      if (itemIndex === null) return;
      return (
        <View
          onTouchEnd={ e => this.handleNodePressed(itemIndex, e) }
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            backgroundColor: 'transparent', // これがないと touch イベントがとれない
            ...style
          }}
          key={ `${itemIndex}-${key}-touch-area` }
        >
        </View>
      );
    };

    return [
      renderView(mainItemIndex, 1, {
        left: 0,
        width: this.childrenLeft + this.nodeMarginLeft,
      }),
      renderView(subItemIndex, 2, {
        right: 0,
        width: this.state.width - (this.childrenLeft + this.nodeMarginLeft),
      })
    ];
  }

  renderItem({ index, item }: { index: number, item: RecordIndexPair }) {
    const { history } = this.props;
    const { prev, defaultNext } = item.record;

    const hasNext = defaultNext !== null;
    const hasPrev = prev !== null;

    let mainItemIndex = 0;
    let subItemIndex = null;

    if (prev !== null) {
      // head 以外の record で prev !== null となる
      const neighbors = history[prev].next;
      const findNextItem = (array, v) => array[(1 + _.indexOf(array, v)) % array.length];
      mainItemIndex = history[prev].defaultNext || 0;
      subItemIndex = mainItemIndex ? findNextItem(neighbors, mainItemIndex) : null;
    }

    const height = this.nodeMarginTop + this.nodeHeight + this.nodeMarginBottom;

    return (
      <View
        style={{
          width: this.state.width,
          height: height
        }}
      >
        { item.record.type === 'move' ? this.renderPair(item.record.pair, index) : null }
        { this.renderMainPath(height, hasNext, hasPrev) }
        { this.renderNode(mainItemIndex, item.historyIndex === mainItemIndex) }
        { this.renderNode(subItemIndex, item.historyIndex === subItemIndex) }
        { this.renderTouchableAreas(mainItemIndex, subItemIndex) }
      </View>
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
      <View style={ [styles.component, this.props.style] }>
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
