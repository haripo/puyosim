import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import NoticePuyos from './NoticePuyos';

export default class ChainResult extends Component {
  constructor() {
    super();
  }

  render() {
    const { chain, score, chainScore } = this.props;
    return (
      <View style={ styles.component }>
        <NoticePuyos score={ chainScore } />
        <Text>
          { chain } 連鎖 { chainScore } 点
        </Text>
        <Text>
          トータル { score } 点
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
  },
});