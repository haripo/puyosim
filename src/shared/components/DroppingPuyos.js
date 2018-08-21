import React from 'react';
import { Component } from 'react';
import { Animated, View } from 'react-native';
import { contentsPadding } from '../utils/constants';
import Puyo from './Puyo';
import _ from 'lodash';

export default class DroppingPuyos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.droppings.length > 0) {
      prevState.progress.setValue(0);
      const maxDistance = _.max(nextProps.droppings.map(d => d.distance));
      Animated.timing(
        prevState.progress,
        {
          toValue: maxDistance,
          duration: 70 * maxDistance,
          useNativeDriver: true
        }
      ).start(() => {
        nextProps.onDroppingAnimationFinished();
      });
    }
    return null;
  }

  renderPuyos() {
    const { droppings, puyoSkin } = this.props;
    const { puyoSize } = this.props.layout;

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
          size={ puyoSize }
          puyo={ d.color }
          skin={ puyoSkin }
          x={ d.col * puyoSize + contentsPadding }
          y={ y }
          key={ `dropping-${d.row}-${d.col}` }/>
      );
    });
  }

  render() {
    return <View>{ this.renderPuyos() }</View>;
  }
}
