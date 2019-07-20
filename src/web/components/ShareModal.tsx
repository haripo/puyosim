import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from '../../shared/platformServices/i18n';
import CopyableTextInput from './CopyableTextInput';

export type Props = {
  wholePathShareUrl: string,
  currentPathShareUrl: string,
  imageUrl: string,
  movieUrl: string
}

type State = {}

export default class ShareModal extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{
        width: 700
      }}>
        <Text style={ styles.title }>{ t('share') }</Text>
        <View>
          <Text>{ t('shareUrlTypeWholePath') }</Text>
          <CopyableTextInput value={ this.props.wholePathShareUrl } />
        </View>
        <View>
          <Text>{ t('shareUrlTypeCurrentPath') }</Text>
          <CopyableTextInput value={ this.props.currentPathShareUrl } />
        </View>
        <View>
          <Text>{ t('shareUrlImage') }</Text>
          <CopyableTextInput value={ this.props.imageUrl } filename='image.gif' />
        </View>
        <View>
          <Text>{ t('shareUrlMovie') }</Text>
          <CopyableTextInput value={ this.props.movieUrl } filename='movie.mp4' />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingBottom: 10
  }
});
