import React, { Component } from 'react';
import { View } from 'react-native';
import { launchAnimation } from '../utils/animation';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      droppings: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { droppings } = this.state;

    if (droppings.length === 0 && nextProps.droppings.length !== 0) {
      this.launchDroppingAnimation(nextProps.droppings);
    }

    if (nextProps.droppings.length === 0) {
      this.setState({ droppings: [] });
    }
  }

  launchDroppingAnimation(droppingPuyos) {
    const droppingSpeed = puyoSize / 8;
    const easingFunction = (p, step) => {
      return Math.min(
        (p.row - p.altitude) * puyoSize + step * droppingSpeed,
        p.row * puyoSize
      );
    };

    this.setState({
      droppings: droppingPuyos.map(p => ({ ...p, value: easingFunction(p, 0) }))
    });

    launchAnimation(step => {
      const animatingPuyos = this.state.droppings
        .map(p => ({ ...p, value: easingFunction(p, step) }));
      this.setState({ droppings: animatingPuyos });
      return animatingPuyos
          .filter(p => step * droppingSpeed < p.altitude * puyoSize)
          .length > 0;
    }).then(() => {
      this.props.onDroppingAnimationFinished();
    });
  }

  renderPuyos() {
    return this.state.droppings.map(dropping => {
      return (
        <Puyo
          size={ puyoSize }
          puyo={ dropping.color }
          x={ dropping.col * puyoSize + contentsPadding }
          y={ dropping.value + contentsPadding }
          key={ `dropping-${dropping.row}-${dropping.col}` }/>
      );
    });
  }

  render() {
    return <View>{ ::this.renderPuyos() }</View>;
  }
}