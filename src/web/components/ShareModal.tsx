import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { themeLightColor } from "../../shared/utils/constants";
import { t } from '../../shared/platformServices/i18n';

export type Props = {
  wholePathShareUrl: string,
  currentPathShareUrl: string
}

type State = {}

export default class ShareModal extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={ styles.title }>{ t('share') }</Text>
        <View>
          <Text>{ t('shareUrlTypeWholePath') }</Text>
          <TextInput style={ styles.urlInput } value={ this.props.wholePathShareUrl } />
        </View>
        <View>
          <Text>{ t('shareUrlTypeCurrentPath') }</Text>
          <TextInput style={ styles.urlInput } value={ this.props.currentPathShareUrl } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingBottom: 10,
  },
  urlInput: {
    width: 600,
    padding: 6,
    margin: 6,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: themeLightColor
  }
});
