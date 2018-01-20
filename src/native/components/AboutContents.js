import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, Button, Linking } from 'react-native';
import I18n from '../../shared/utils/i18n';
import VersionNumber from 'react-native-version-number';
import { themeColor, themeLightColor } from '../../shared/utils/constants';

export default class AboutContents extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  componentDidMount() {
    this.props.navigator.setTitle({ title: "About" });

    this.websiteURL = "http://puyos.im";
    this.feedbackURL = "http://puyos.im/feedback.html";
    this.licensesURL  = "http://puyos.im/license.txt";
  }

  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.row }>
          <Text style={ styles.title }>puyosim { VersionNumber.appVersion }</Text>
        </View>
        <View style={ styles.row }>
          <Button style={ styles.button }
                  onPress={ () => Linking.openURL(this.websiteURL) }
                  title="view website" />
        </View>
        <View style={ styles.row }>
          <Button style={ styles.button }
                  onPress={ () => Linking.openURL(this.feedbackURL) }
                  title="send feedback" />
        </View>
        <View style={ styles.row } >
          <Button style={ styles.button }
                  onPress={ () => Linking.openURL(this.licensesURL) }
                  title="open source licenses" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    alignItems: 'stretch'
  },
  title: {
    fontSize: 20
  },
  logo: {
    width: 200,
    resizeMode: 'contain'
  },
  row: {
    padding: 10
  }
});