import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { parse } from 'query-string';
import Modal from 'react-modal';
import { ShareUrls } from "../../shared/selectors/simulatorSelectors";

export type Props = {
  shareURLs: ShareUrls
}

type State = {}

export default class ShareModal extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  handleTwitterSharePressed() {
  }

  render() {
    return (
      <View>
        <Text onPress={ this.handleTwitterSharePressed.bind(this) }>share via Twitter</Text>
        <Text>{ this.props.shareURLs.whole }</Text>
        <Text>{ this.props.shareURLs.current }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
