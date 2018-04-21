/**
 * Component for render history-tree
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding, puyoSize, screenHeight, themeColor } from '../utils/constants';
import SvgPuyo from './SvgPuyo';
import Svg, {
  Image,
  Rect,
  Text,
} from 'react-native-svg';

const arrowImages = {
  up: require('../../../assets/history_tree/arrow-up.svg'),
  down: require('../../../assets/history_tree/arrow-down.svg'),
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
          skin={ puyoSkin } />
        <SvgPuyo
          size={ 30 }
          puyo={ 1 }
          x={ x + 30 }
          y={ y }
          skin={ puyoSkin } />
      </React.Fragment>
    );
  }
  renderNode() {
    const x = 150;
    const y = 150;
    return (
      <React.Fragment>
        <Rect
          x={ x }
          y={ y }
          width="60"
          height="36"
          stroke={ themeColor }
          strokeWidth="2"
          fill="none"
          rx="4"
          ry="4" />
        <Image x={ x } y={ y } href={ numberImages[0] } />
        <Image x={ x + 30 } y={ y } href={ arrowImages.up } />
      </React.Fragment>
    );
  }

  render() {
    return (
      <View style={ styles.component }>
        <Svg height="100%">
          { this.renderNode() }
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


