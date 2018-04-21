/**
 * Component for render history-tree
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsPadding } from '../utils/constants';
import Puyo from './Puyo';
import Svg, {
  Circle,
  Rect,
} from 'react-native-svg';

export default class HistoryTree extends React.Component {
  render() {
    return (
      <View style={ styles.component }>
        <Svg
          height="100"
          width="100"
        >
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    backgroundColor: cardBackgroundColor,
  },
});


