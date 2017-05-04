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
  renderPuyo(puyo) {
    const image = require('../../assets/puyo.png');
    return (
      <Image source={image} style={ styles.puyo }/>
    );
  }

  renderStack(stack) {
    const renderRow = (row) => {
      return (
        <View style={ styles.fieldRow }>
          { row.map(this.renderPuyo) }
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