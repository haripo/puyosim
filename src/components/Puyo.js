/* @flow */

import React, { PureComponent } from 'react';
import { Image, View } from 'react-native';

const puyoImages = [
  null,
  require('../../assets/puyo_red.png'),
  require('../../assets/puyo_green.png'),
  require('../../assets/puyo_blue.png'),
  require('../../assets/puyo_yellow.png')
];

const connectionImages = [
  {
    horizontal: require('../../assets/puyo_red_connect_horizontal.png'),
    vertical: require('../../assets/puyo_red_connect_vertical.png')
  },
  {
    horizontal: require('../../assets/puyo_green_connect_horizontal.png'),
    vertical: require('../../assets/puyo_green_connect_vertical.png')
  },
  {
    horizontal: require('../../assets/puyo_blue_connect_horizontal.png'),
    vertical: require('../../assets/puyo_blue_connect_vertical.png')
  },
  {
    horizontal: require('../../assets/puyo_yellow_connect_horizontal.png'),
    vertical: require('../../assets/puyo_yellow_connect_vertical.png')
  }
];


/**
 * Component for render single puyo
 */
export default class Puyo extends PureComponent {
  style() {
    return {
      position: 'absolute',
      top: this.props.y,
      left: this.props.x,
      width: this.props.size + 1,
      height: this.props.size + 1,
      opacity: this.props.a || 1
    };
  }

  imageStyle() {
    return {
      width: this.props.size,
      height: this.props.size
    };
  }

  renderConnection() {
    const { connections, puyo } = this.props;
    if (!connections) return null;
    const base = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.props.size,
      height: this.props.size
    };
    const half = this.props.size / 2;
    const image = connectionImages[puyo - 1];
    const render = (source, style, key) => {
      return (
        <Image source={ source } style={ [base, style] } key={ key } />
      )
    };

    return [
      connections.top ? render(image.vertical, { top: -half - 1 }, 't') : null,
      connections.bottom ? render(image.vertical, { top: this.props.size - half }, 'b') : null,
      connections.left ? render(image.horizontal, { left: -half }, 'l') : null,
      connections.right ? render(image.horizontal, { left: this.props.size - half }, 'r') : null,
    ]
  }

  render() {
    const image = puyoImages[this.props.puyo];
    if (image === null) return null;

    return (
      <View style={ this.style() } pointerEvents="none">
        <Image style={ this.imageStyle() } source={ image }/>
        { this.renderConnection() }
      </View>
    );
  }
}
