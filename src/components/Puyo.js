/* @flow */

import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

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
    return {
      ...styles.puyo,
      width: this.props.size,
      height: this.props.size
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

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    backgroundColor: 'gray'
  }
});