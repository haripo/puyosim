import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { parse } from 'query-string';
import Modal from 'react-modal';

export type Props = {
  shareURL: string
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
        <Text>{ this.props.shareURL }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
