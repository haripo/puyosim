import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { webToolbarSize, themeColor, themeLightColor } from '../../shared/utils/constants';

type Props = {
  onSharePressed: () => void
}

export default class WebToolbar extends React.Component<Props, {}> {
  handleSharePressed() {
    this.props.onSharePressed();
  }

  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.inner }>
          <Text style={ styles.logo }>
            puyosim web
          </Text>
          <View style={ styles.navigation }>
            <Text
              onPress={ this.handleSharePressed.bind(this) }
              style={ styles.navigationItem }
            >
              シェア
            </Text>
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
    height: webToolbarSize - 3,
    backgroundColor: themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    // @ts-ignore
    outline: 0
  }
});
