import React, { Component } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { themeColor, themeLightColor } from '../../shared/utils/constants';

export default class AboutContents extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'About' });

    this.websiteURL = 'http://puyos.im';
    this.feedbackURL = 'http://puyos.im/feedback.html';
    this.licensesURL = 'http://puyos.im/license.txt';
  }

  handleKennyPressed() {
    this.props.onSetKennySelected();
  }

  handleSnakePressed() {
    this.props.onSetSnakeSelected();
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
                  title="view website"/>
        </View>
        <View style={ styles.row }>
          <Button style={ styles.button }
                  onPress={ () => Linking.openURL(this.feedbackURL) }
                  title="send feedback"/>
        </View>
        <View style={ styles.row }>
          <Button style={ styles.button }
                  onPress={ () => Linking.openURL(this.licensesURL) }
                  title="open source licenses"/>
        </View>
        { __DEV__ &&
          <View style={ styles.row }>
            <Button style={ styles.button }
                    onPress={ () => this.handleKennyPressed() }
                    title="DEBUG: kenny19"/>
            <Button style={ styles.button }
                    onPress={ () => this.handleSnakePressed() }
                    title="DEBUG: snake"/>
          </View>
        }
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