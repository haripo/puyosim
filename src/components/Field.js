/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View
} from 'react-native';
import { puyoSize } from '../utils/constants';

/**
 * Component for render puyo field
 */
export default class Field extends Component {
  constructor() {
    super();
    this.images = [
      null,
      require('../../assets/puyo_red.png'),
      require('../../assets/puyo_green.png'),
      require('../../assets/puyo_blue.png'),
      require('../../assets/puyo_yellow.png')
    ]
  }
  renderPuyo(puyo, index) {
    const image = this.images[puyo];
    if (image) {
      return (
        <Image source={ image } style={ styles.puyo } key={ index }/>
      )
    } else {
      return (
        <View style={ styles.puyo } key={ index }>
        </View>
      )
    }
  }

  renderStack(stack) {
    const renderRow = (row, index) => {
      return (
        <View style={ styles.fieldRow } key={ index }>
          { row.map(::this.renderPuyo) }
        </View>
      )
    };

    return (
      <View>
        { stack.map(renderRow) }
      </View>
    );
  }

  render() {
    return (
      <View style={ this.props.style }>
        { this.renderStack(this.props.stack) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row'
  },
  puyo: {
    width: puyoSize,
    height: puyoSize
  }
});