import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      progress: new Animated.Value(0)
    };
  }

  componentWillReceiveProps() {
    this.launchDroppingAnimation();
  }

  launchDroppingAnimation() {
    this.state.progress.setValue(0);
    Animated.timing(
      this.state.progress,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }
    ).start(() => {
      // animation is finished
      this.props.onDroppingAnimationFinished();
    });
  }

  renderPuyos() {
    const { droppings } = this.props;

    return droppings.map(d => {
      const y = this.state.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [
          (d.row - d.altitude) * puyoSize + contentsPadding,
          d.row * puyoSize + contentsPadding
        ]
      });

      return (
        <Puyo
          size={puyoSize}
          puyo={d.color}
          x={d.col * puyoSize + contentsPadding}
          y={y}
          key={`dropping-${d.row}-${d.col}`}/>
      );
    });
  }

  render() {
    return <View>{::this.renderPuyos()}</View>;
  }
}