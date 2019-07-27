import React, { Component } from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import { cardBackgroundColor, contentsMargin, contentsPadding } from '../utils/constants';
import { ojamaImages } from '../assets/puyoImages';
import { getOjamaNotification } from '../models/score';

type Props = {
  score: number
};

/**
 * Component for render notice puyos
 */
export default class NoticePuyos extends Component<Props, {}> {
  renderNoticePuyos() {
    const puyos = getOjamaNotification(this.props.score);
    return puyos.map((type, index) => {
      const style = [styles.puyo, { left: index * 24 + contentsPadding }];
      return (
        <Image source={ ojamaImages[type] } style={ style as ImageStyle } key={ index }/>
      );
    });
  }

  render() {
    return (
      <View style={ styles.component }>
        { this.renderNoticePuyos() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    backgroundColor: cardBackgroundColor,
    marginTop: contentsMargin,
    height: 32 + contentsPadding * 2,
    elevation: 2,
  },
  puyo: {
    width: 32,
    height: 32,
    top: contentsPadding,
    position: 'absolute'
  }
});