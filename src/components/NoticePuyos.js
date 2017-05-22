// @flow

import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { contentsMargin, puyoSize } from '../utils/constants';

/**
  * Component for render notice puyos
*/
export default class NoticePuyos extends Component {
  constructor() {
    super();
    this.rate = 70;
    this.noticeVolumes = [
      1,
      6,
      30,
      200,
      300,
      400
    ];

    this.images = [
      require('../../assets/ojama_small.png'),
      require('../../assets/ojama_large.png'),
      require('../../assets/ojama_stone.png'),
      require('../../assets/ojama_mushroom.png'),
      require('../../assets/ojama_star.png'),
      require('../../assets/ojama_crown.png')
    ];
  }

  getRenderNoticePuyos(counts) {
    let result = [];
    for (let i = 0; i < this.noticeVolumes.length; i++) {
      const r = this.noticeVolumes.length - i - 1;
      const volume = this.noticeVolumes[r];
      while (counts >= volume) {
        result.push(r);
        counts -= volume;
      }
    }
    return result;
  }

  renderNoticePuyos() {
    const counts = Math.floor(this.props.score / this.rate);
    const puyos = this.getRenderNoticePuyos(counts);
    return puyos.map((type, index) => {
      const style = [styles.puyo, { left: index * 16 }];
      return (
        <Image source={ this.images[type] } style={ style } key={ index }/>
      )
    });
  }

  render() {
    return (
      <View style={ styles.component }>
        { this.renderNoticePuyos() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    backgroundColor: '#BBBBBB',
    marginTop: contentsMargin,
    height: 32,
  },
  puyo: {
    width: 32,
    height: 32,
    position: 'absolute'
  }
});