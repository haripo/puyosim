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
    const maxAltitude = _.max(droppings.map(d => d.altitude));
    Animated.timing(
      this.state.progress,
      {
        toValue: maxAltitude,
        duration: 100 * maxAltitude,
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
    const { droppings } = this.props;

    const maxAltitude = _.max(this.props.droppings.map(d => d.altitude));
    return droppings.map(d => {
      const y = this.state.progress
        .interpolate({
          inputRange: [0, d.altitude, maxAltitude],
          outputRange: [
            (d.row - d.altitude) * puyoSize + contentsPadding,
            d.row * puyoSize + contentsPadding,
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