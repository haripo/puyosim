import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { themeColor, themeLightColor } from "../../shared/utils/constants";
import { Navigation } from "react-native-navigation";
import { ArchivedPlay } from "../../shared/utils/StorageService.native";

export type Props = {
  componentId: string,
}

type State = {
}

export default class RightDrawer extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text>
          Title
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%'
  },
});