/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Simulator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Welcome to React Native!
        </Text>
        <Text>
          { this.props.field }
        </Text>
        <Button
          onPress={ () => this.props.put(1) }
          title="Put pair"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  }
});