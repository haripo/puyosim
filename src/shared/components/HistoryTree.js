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

  renderNode(x, y, move) {
    const size = 32;
    const iconSize = 32;
    if (move === null) {
      return null; // root node
    }
    return (
      <G key={ x + move.rotation + move.col }>
        <Rect
          x={ x }
          y={ y }
          width={ size * 2 - 6 }
          height={ size }
          stroke={ themeColor }
          strokeWidth="2"
          fill="none"
          rx="4"
          ry="4"/>
        <Image x={ x } y={ y } width={ iconSize } height={ iconSize } href={ numberImages[move.col] }/>
        <Image x={ x + size - 8 } y={ y } width={ iconSize } height={ iconSize } href={ arrowImages[move.rotation] }/>
      </G>
    );
  }

  renderPath(x1, x2, y1, y2) {
    x1 += 58 / 2;
    y1 += 32;
    x2 += 58 / 2;
    return (
      <Path
        d={ `M ${x1} ${y1} C ${x1} ${y1 + 30} ${x2} ${y2 - 30} ${x2} ${y2}` }
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
          <React.Fragment>
            { historyIndex === 0 ? null : this.renderPath(parentWidth * 100 + 20, width * 100 + 20, (depth - 1) * 100 + 20, depth * 100 + 20) }
            { this.renderNode(width * 100 + 20, depth * 100 + 20, history[nextIndex].move) }
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


