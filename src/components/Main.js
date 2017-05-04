/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';

class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Welcome to React Native!
        </Text>
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

const mapStateToProps = () => {
  return {}
};

const mapDispatchToProps = () => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
