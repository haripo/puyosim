import React, { Component } from 'react';
import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VersionNumber from 'react-native-version-number';
import { themeColor, themeLightColor } from '../../shared/utils/constants';
import Icon from "./Simulator";

type Props = {
  onSetKennySelected: () => void,
  onSetSnakeSelected: () => void,
  onSetComplexHistorySelected: () => void,
}

export default class AboutContents extends Component<Props, {}> {

  static websiteURL = 'http://rens.im';
  static feedbackURL = 'http://rens.im/feedback.html';
  static licensesURL = 'http://rens.im/license.txt';

  static navigationOptions = () => ({
    title: 'About'
  });

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
          <Text style={ styles.title }>rensim { VersionNumber.appVersion }</Text>
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