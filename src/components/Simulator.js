/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, ToolbarAndroid, View } from 'react-native';
import { contentsMargin } from '../utils/constants';
import Field from './Field';
import NextWindow from './NextWindow';

export default class Simulator extends Component {
  render() {
    const actions = [
      { title: 'Filter' },
      { title: 'Filter' },
      { title: 'Filter' },
      { title: 'Filter' }
    ];
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          actions={ actions }
          style={ styles.toolbar }
          title='ぷよシミュレータ'/>
        <View style={ styles.contents }>
          <Field
            stack={ this.props.stack }
            highlights={ this.props.highlights }
            ghosts={ this.props.ghosts }
            droppingPuyos={ this.props.droppingPuyos }
            style={ styles.field }
            onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
            onSwiping={ this.props.onSwiping }
            onSwipeEnd={ this.props.onSwipeEnd }>
          </Field>
          <View style={ styles.head }>
            <NextWindow
              next={ this.props.next }
              doubleNext={ this.props.doubleNext }/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f5fcff'
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56
  },
  contents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  head: {
    flex: 1,
    margin: contentsMargin
  },
  field: {
    backgroundColor: '#BBBBBB',
    margin: contentsMargin
  }
});