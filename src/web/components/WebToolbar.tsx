import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { webToolbarSize, themeColor, themeLightColor } from '../../shared/utils/constants';

export default class WebToolbar extends React.Component {
  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.inner }>
          <Text style={ styles.logo }>
            puyosim web
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    height: webToolbarSize,
    backgroundColor: themeLightColor
  },
  inner: {
    height: webToolbarSize - 3,
    backgroundColor: themeColor
  },
  logo: {
    color: themeLightColor,
    fontSize: 24,
    lineHeight: webToolbarSize - 3,
    marginLeft: 16,
  }
});
