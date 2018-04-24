/**
 * Component for render history-tree
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding, puyoSize, screenHeight, themeColor } from '../utils/constants';
import SvgPuyo from './SvgPuyo';
import Svg, {
  Image,
  Line,
  Rect,
  G,
  Path,
} from 'react-native-svg';

const arrowImages = {
  top: require('../../../assets/history_tree/arrow-top.svg'),
  bottom: require('../../../assets/history_tree/arrow-bottom.svg'),
  left: require('../../../assets/history_tree/arrow-left.svg'),
  right: require('../../../assets/history_tree/arrow-right.svg')
};

const numberImages = [
  require('../../../assets/history_tree/number1.svg'),
  require('../../../assets/history_tree/number2.svg'),
  require('../../../assets/history_tree/number3.svg'),
  require('../../../assets/history_tree/number4.svg'),
  require('../../../assets/history_tree/number5.svg'),
  require('../../../assets/history_tree/number6.svg')
];

export default class HistoryTree extends React.Component {

  // layout constants
  baseX = 20;
  baseY = 20;
  iconSize = 32;
  nodeWidth = this.iconSize * 2 - 6;
  iconPadding = -8;
  nodePaddingX = 100;
  nodePaddingY = 100;
  pathRound = 40;

  renderHands() {
    const x = 10;
    const y = 10;
    const puyoSkin = 'puyoSkinDefault';
    return (
      <React.Fragment>
        <SvgPuyo
          size={ 30 }
          puyo={ 1 }
          x={ x }
          y={ y }
          skin={ puyoSkin }/>
        <SvgPuyo
          size={ 30 }
          puyo={ 1 }
          x={ x + 30 }
          y={ y }
          skin={ puyoSkin }/>
      </React.Fragment>
    );
  }

  renderNode(row, col, move) {
    if (move === null) {
      return null; // root node
    }
    const x = row * this.nodePaddingX + this.baseX;
    const y = col * this.nodePaddingY + this.baseY;

    return (
      <G>
        <Rect
          x={ x }
          y={ y }
          width={ this.nodeWidth }
          height={ this.iconSize }
          stroke={ themeColor }
          strokeWidth="2"
          fill="none"
          rx="4"
          ry="4"/>
        <Image
          x={ x }
          y={ y }
          width={ this.iconSize }
          height={ this.iconSize }
          href={ numberImages[move.col] }
        />
        <Image
          x={ x + this.iconSize + this.iconPadding }
          y={ y }
          width={ this.iconSize }
          height={ this.iconSize }
          href={ arrowImages[move.rotation] }
        />
      </G>
    );
  }

  renderPath(row1, row2, col1, col2) {
    const x1 = row1 * this.nodePaddingX + this.baseX + this.nodeWidth / 2;
    const y1 = col1 * this.nodePaddingY + this.baseY + this.iconSize;
    const x2 = row2 * this.nodePaddingX + this.baseX + this.nodeWidth / 2;
    const y2 = col2 * this.nodePaddingY + this.baseY;
    return (
      <Path
        d={ `M ${x1} ${y1} C ${x1} ${y1 + this.pathRound} ${x2} ${y2 - this.pathRound} ${x2} ${y2}` }
        stroke={ themeColor }
        strokeWidth="2"
        fill="none"
      />
    );
  }

  renderTree(history) {
    let width = 0;
    const renderChildren = (historyIndex, depth, parentWidth) => {
      const record = history[historyIndex];
      if (!record) {
        return null;
      }

      return record.next.map((nextIndex, index) => {
        if (index > 0) {
          width += 1;
        }
        return (
          <React.Fragment key={ index }>
            { historyIndex === 0 ? null : this.renderPath(parentWidth, width, depth - 1, depth) }
            { this.renderNode(width, depth, history[nextIndex].move) }
            { renderChildren(nextIndex, depth + 1, width) }
          </React.Fragment>
        );
      });
    };

    return renderChildren(0, 0);
  }

  render() {
    return (
      <View style={ styles.component }>
        <Svg height="100%">
          { this.renderTree(this.props.history) }
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: cardBackgroundColor,
    marginTop: contentsPadding,
    marginRight: contentsPadding,
    marginBottom: contentsPadding
  },
});


