import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { themeColor, themeLightColor, webToolbarSize } from '../../shared/utils/constants';

type Props = {
}

export default class WebToolbar extends React.Component<Props, {}> {
  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.inner }>
          <Text style={ styles.logo }>
            puyosim
          </Text>
          <View style={ styles.navigation }>
          {/* 右側に表示されるナビゲーション */}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    height: webToolbarSize,
    backgroundColor: themeLightColor,
  },
  inner: {
    height: webToolbarSize,
    backgroundColor: themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // boxShadow: '0px 4px 2px -2px rgba(0, 0, 0, 0.2)'
  },
  logo: {
    color: themeLightColor,
    fontSize: 24,
    lineHeight: webToolbarSize - 3,
    marginLeft: 16,
  },
  navigation: {
    marginRight: 16
  },
  navigationItem: {
    lineHeight: webToolbarSize - 3,
    color: 'white',
  }
});
