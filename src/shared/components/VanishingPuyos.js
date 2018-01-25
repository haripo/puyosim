import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      progress: new Animated.Value(0),
      isAnimating: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isAnimating && nextProps.vanishings.length > 0) {
      this.launchVanishingAnimation();
    }
  }

  launchVanishingAnimation() {
    this.state.progress.setValue(0);
    Animated.timing(
      this.state.progress,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      this.setState({ isAnimating: false });
      this.props.onVanishingAnimationFinished();
    });
    this.setState({ isAnimating: true });
  }

  getInterpolateOption() {
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

  renderPuyos() {
    return this.props.vanishings.map(v => {
      const a = this.state.progress.interpolate(this.getInterpolateOption());

      return (
        <Puyo
          size={ puyoSize }
          puyo={ v.color }
          connections={ v.connections }
          x={ v.col * puyoSize + contentsPadding }
          y={ v.row * puyoSize + contentsPadding }
          a={ a }
          key={ `vanishing-${v.row}-${v.col}` }/>
      );
    });
  }

  render() {
    return <View>{ ::this.renderPuyos() }</View>;
  }
}