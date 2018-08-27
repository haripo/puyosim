import React from 'react';
import { Image } from 'react-native-svg';
import Puyo from './Puyo';

export default class SvgPuyo extends Puyo {
  render() {
    const image = this.getImage();
    if (image === null) return null;

    if (typeof this.props.y !== "number") {
      throw 'SvgPuyo does not support Animated value';
    }

    return (
      <Image
        href={ image }
        x={ this.props.x }
        y={ this.props.y }
        width={ this.props.size }
        height={ this.props.size }
      />
    );
  }
}
