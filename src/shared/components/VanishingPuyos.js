import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import { contentsPadding } from '../utils/constants';
import Puyo from './Puyo';

function getInterpolateOption() {
  let inputRange = [];
  let outputRange = [];
  for (let i = 0; i < 10; i++) {
    inputRange.push(i / 10);
    inputRange.push((i + 1) / 10);
    outputRange.push(i % 2);
    outputRange.push(i % 2)
  }
  inputRange.push(1);
  outputRange.push(0);
  return { inputRange, outputRange };
}
const interpolation = getInterpolateOption();

export default class DroppingPuyos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.vanishings.length > 0) {
      prevState.progress.setValue(0);
      Animated.timing(
        prevState.progress,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }
      ).start(() => {
        nextProps.onVanishingAnimationFinished();
      });
    }
    return null;
  }


  renderPuyos() {
    const { puyoSize } = this.props.layout;

    return this.props.vanishings.map(v => {
      const a = this.state.progress.interpolate(interpolation);

      return (
        <Puyo
          size={ puyoSize }
          puyo={ v.color }
          skin={this.props.puyoSkin}
          connections={ v.connections }
          x={ v.col * puyoSize + contentsPadding }
          y={ v.row * puyoSize + contentsPadding }
          a={ a }
          key={ `vanishing-${v.row}-${v.col}` }/>
      );
    });
  }

  render() {
    return <View>{ this.renderPuyos() }</View>;
  }
}
