/* @flow */

import React, { Component } from 'react';
import { Image, View } from 'react-native';

const puyoImages = [
  null,
  require('../../assets/puyo_red.png'),
  require('../../assets/puyo_green.png'),
  require('../../assets/puyo_blue.png'),
  require('../../assets/puyo_yellow.png')
];

/**
 * Component for render single puyo
 */
export default class Puyo extends Component {
  style() {

    if (this.props.shiftY) {
      console.log(1 + this.props.shiftY);
    }

    return {
      position: 'absolute',
      top: -(this.props.shiftY || 0) * this.props.size,
      left: 0,
      //opacity: this.props.shiftY ? 1 : 0.5,
      width: this.props.size,
      height: this.props.size,
    };
  }
  render() {
    const image = puyoImages[this.props.puyo];

    if (image === null) return null;

    return (
      <Image style={ this.style() } source={ image }/>
    )
  }
}
