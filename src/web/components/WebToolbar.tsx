import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { themeColor, themeLightColor, webToolbarSize } from '../../shared/utils/constants';

function openLink(url: string) {
  // @ts-ignore
  window.open(url, "_blank");
}

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
            <View style={ styles.navigationItem }>
              <Text style={ { color: themeLightColor } }>
                Also available on
              </Text>
              <TouchableOpacity onPress={ () => openLink('https://apps.apple.com/us/app/puyosim/id1435074935') }>
                <Text style={ { color: themeLightColor, margin: 3 } }>
                  iOS
                </Text>
              </TouchableOpacity>
              <Text style={ { color: themeLightColor } }>
                /
              </Text>
              <TouchableOpacity onPress={ () => openLink('https://play.google.com/store/apps/details?id=com.puyosimulator') }>
                <Text style={ { color: themeLightColor, margin: 3 } }>
                  Android
                </Text>
              </TouchableOpacity>
            </View>
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
