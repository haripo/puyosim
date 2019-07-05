import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NoticePuyos from './NoticePuyos';
import { t } from '../platformServices/i18n';

type Props = {
  chain: number,
  score: number,
  chainScore: number
}

export default class ChainResult extends Component<Props, {}> {
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