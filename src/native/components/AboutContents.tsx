import React, { Component } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { themeColor, themeLightColor } from '../../shared/utils/constants';

type Props = {
  onSetKennySelected: () => void,
  onSetSnakeSelected: () => void,
  onSetComplexHistorySelected: () => void,
}

export default class AboutContents extends Component<Props, {}> {

  static websiteURL = 'http://puyos.im';
  static feedbackURL = 'http://puyos.im/feedback.html';
  static licensesURL = 'http://puyos.im/license.txt';

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'About',
          color: themeLightColor
        },
        background: {
          color: themeColor
        },
      },
      layout: {
        orientation: 'portrait'
      }
    }
  }

  componentDidMount() {
  }

  handleKennyPressed() {
    this.props.onSetKennySelected();
  }

  handleSnakePressed() {
    this.props.onSetSnakeSelected();
  }

  handleComplexHistoryPressed() {
    this.props.onSetComplexHistorySelected();
  }

  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.row }>
          <Text style={ styles.title }>puyosim { VersionNumber.appVersion }</Text>
        </View>
        <View style={ styles.row }>
          <Button onPress={ () => Linking.openURL(AboutContents.websiteURL) }
                  title="view website"/>
        </View>
        <View style={ styles.row }>
          <Button onPress={ () => Linking.openURL(AboutContents.feedbackURL) }
                  title="send feedback"/>
        </View>
        <View style={ styles.row }>
          <Button onPress={ () => Linking.openURL(AboutContents.licensesURL) }
                  title="open source licenses"/>
        </View>
        { __DEV__ &&
          <View style={ styles.row }>
            <Button onPress={ () => this.handleKennyPressed() }
                    title="DEBUG: kenny19"/>
            <Button onPress={ () => this.handleSnakePressed() }
                    title="DEBUG: snake"/>
            <Button onPress={ () => this.handleComplexHistoryPressed() }
                    title="DEBUG: complex history"/>
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
    margin: 10
  }
});