import React, { Component } from 'react';
import { Text, View } from 'react-native';
import NoticePuyos from './NoticePuyos';
import { t } from '../platformServices/i18n';

type Props = {
  chain: number,
  score: number,
  chainScore: number,
  textAlign?: string
}

export default class ChainResult extends Component<Props, {}> {
  render() {
    const { chain, score, chainScore, textAlign } = this.props;
    return (
      <View>
        <NoticePuyos score={ chainScore }/>
        <Text style={ { textAlign: textAlign == 'left' ? 'left' : 'right' } }>
          { chain } { t('chain') } { chainScore } { t('points') }
        </Text>
        <Text style={ { textAlign: textAlign == 'left' ? 'left' : 'right' } }>
          { t('total') } { score } { t('points') }
        </Text>
      </View>
    )
  }
}
