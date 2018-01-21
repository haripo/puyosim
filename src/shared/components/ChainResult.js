import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import NoticePuyos from './NoticePuyos';
import t from '../service/i18n';

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
          { chain } { t('chain') } { chainScore } { t('points') }
        </Text>
        <Text>
          { t('total') } { score } { t('points') }
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
  },
});