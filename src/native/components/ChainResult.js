import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import NoticePuyos from './NoticePuyos';
import I18n from '../../shared/utils/i18n';

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
          { chain } { I18n.t('chain') } { chainScore } { I18n.t('points') }
        </Text>
        <Text>
          { I18n.t('total') } { score } { I18n.t('points') }
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
  },
});