import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      vanishings: [], // TODO: remove this
      progress: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { vanishings } = this.state;

    if (vanishings.length === 0 && nextProps.vanishings.length !== 0) {
      this.launchVanishingAnimation();
    }

    if (nextProps.vanishings.length === 0) {
      this.setState({ vanishings: [] });
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
      // animation is finished
      this.props.onVanishingAnimationFinished();
    });
  }

  renderPuyos() {
    return this.props.vanishings.map(v => {
      const a = this.state.progress.interpolate({
        inputRange: [0, 0.2, 0.2, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8, 1, 1],
        outputRange: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]
      });

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