import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';
import _ from 'lodash';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      progress: new Animated.Value(0),
      isAnimating: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isAnimating && nextProps.droppings.length > 0) {
      this.launchDroppingAnimation(nextProps.droppings);
    }
  }

  launchDroppingAnimation(droppings) {
    this.state.progress.setValue(0);
    const maxDistance = _.max(droppings.map(d => d.distance));
    Animated.timing(
      this.state.progress,
      {
        toValue: maxDistance,
        duration: 70 * maxDistance,
        useNativeDriver: true
      }
    ).start(() => {
      // animation is finished
      this.setState({ isAnimating: false });
      this.props.onDroppingAnimationFinished();
    });
    this.setState({ isAnimating: true });
  }

  renderPuyos() {
    const { droppings, puyoSkin } = this.props;

    const maxDistance = _.max(this.props.droppings.map(d => d.distance));
    return droppings.map(d => {
      const y = this.state.progress
        .interpolate({
          inputRange: [0, d.distance, maxDistance],
          outputRange: [
            (d.row - d.distance) * puyoSize + contentsPadding,
            d.row * puyoSize + contentsPadding,
            d.row * puyoSize + contentsPadding
          ]
        });

      return (
        <Puyo
          size={puyoSize}
          puyo={d.color}
          skin={puyoSkin}
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