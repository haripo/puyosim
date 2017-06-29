import React, { Component } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import I18n from '../utils/i18n';
import { themeColor, themeLightColor } from '../utils/constants';

export default class AboutContents extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  componentDidMount() {
    this.props.navigator.setTitle({ title: "About" })
  }

  render() {
    return (
      <View style={ styles.component }>
        <Image style={ styles.logo } source={ require('../../raw_assets/icon.png') } />
        <Text>
          Puyosim
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    alignItems: 'center'
  },
  logo: {
    width: '50%',
    resizeMode: 'contain'
  }
});