import React, { Component } from 'react';
import { View } from 'react-native';
import { launchAnimation } from '../utils/animation';
import { contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class DroppingPuyos extends Component {
  constructor() {
    super();
    this.state = {
      vanishings: []
    };
  }


  componentWillReceiveProps(nextProps) {
    const { vanishings } = this.state;

    if (vanishings.length === 0 && nextProps.vanishings.length !== 0) {
      this.launchVanishingAnimation(nextProps.vanishings);
    }

    if (nextProps.vanishings.length === 0) {
      this.setState({ vanishings: [] });
    }
  }


  launchVanishingAnimation(vanishingPuyos) {
    this.setState({
      vanishings: vanishingPuyos.map(p => ({ ...p, value: 0 }))
    });
    const easingFunction = step => step % 2 === 0 ? 0 : 1;
    launchAnimation((step) => {
      const animatingPuyos = this.state.vanishings
        .filter(p => step < 30)
        .map(p => {
          return { ...p, value: easingFunction(step) };
        });
      this.setState({ vanishings: animatingPuyos });
      return animatingPuyos.length > 0;
    }).then(() => {
      this.props.onVanishingAnimationFinished();
    });
  }

  renderPuyos() {
    return this.state.vanishings.map(vanishing => {
      return (
        <Puyo
          size={ puyoSize }
          puyo={ vanishing.color }
          connections={ vanishing.connections }
          x={ vanishing.col * puyoSize + contentsPadding }
          y={ vanishing.row * puyoSize + contentsPadding }
          a={ vanishing.value }
          key={ `vanishing-${vanishing.row}-${vanishing.col}` }/>
      );
    });
  }

  render() {
    return <View>{ ::this.renderPuyos() }</View>;
  }
}