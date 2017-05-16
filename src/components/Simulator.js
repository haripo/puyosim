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
  constructor() {
    super();
    this.actions = [
      { title: 'Undo' }
    ];
  }

  handleToolbarAction(position) {
    switch (this.actions[position].title) {
      case 'Undo':
        this.props.onUndoSelected();
        break;
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <ToolbarAndroid
          actions={ this.actions }
          style={ styles.toolbar }
          title='ぷよシミュレータ'
          onActionSelected={ ::this.handleToolbarAction }/>
        <View style={ styles.contents }>
          <Field
            stack={ this.props.stack }
            highlights={ this.props.highlights }
            ghosts={ this.props.ghosts }
            droppingPuyos={ this.props.droppingPuyos }
            vanishingPuyos={ this.props.vanishingPuyos }
            style={ styles.field }
            onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
            onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
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