import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  buttonColor,
  contentsMargin,
  controllerButtonHeight,
  controllerButtonWidth
} from '../../shared/utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

export default class SimulatorControls extends PureComponent {
  renderShortcut(key) {
    if (key) {
      return (
        <Text style={ styles.shortcut }>{ key }</Text>
      )
    }
    return null;
  }

  render() {
    const shortcuts = _.mapValues(this.props.shortcuts || {},(shortcut) => `(${shortcut})`);

    return (
      <View style={ { flexDirection: 'column' } }>
        <View style={ styles.buttonGroup }>
          <TouchableOpacity
            disabled={ !this.props.canUndo }
            style={ styles.controllerButton }
            activeOpacity={ this.props.canUndo ? 0.7 : 1 }
            onClick={ this.props.onUndoSelected }
            onPress={ this.props.onUndoSelected }>
            <Icon name="undo" size={ 30 } color="#FFF"/>
            <Text style={ { color: '#FFF' } }>Undo</Text>
            { this.renderShortcut(shortcuts.undo) }
          </TouchableOpacity>
          <TouchableOpacity
            disabled={ !this.props.canRedo }
            style={ styles.controllerButton }
            activeOpacity={ this.props.canRedo ? 0.7 : 1 }
            onClick={ this.props.onRedoSelected }
            onPress={ this.props.onRedoSelected }>
            <Icon name="redo" size={ 30 } color="#FFF"/>
            <Text style={ { color: '#FFF' } }>Redo</Text>
            { this.renderShortcut(shortcuts.redo) }
          </TouchableOpacity>
        </View>
        <View style={ styles.buttonGroup }>
          <TouchableOpacity
            style={ styles.controllerButton }
            onClick={ this.props.onRotateLeftPressed }
            onPress={ this.props.onRotateLeftPressed }
            disabled={ !this.props.isActive }>
            <Icon name="rotate-left" size={ 30 } color="#FFF"/>
            { this.renderShortcut(shortcuts.rotateLeft) }
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.controllerButton }
            onClick={ this.props.onRotateRightPressed }
            onPress={ this.props.onRotateRightPressed }
            disabled={ !this.props.isActive }>
            <Icon name="rotate-right" size={ 30 } color="#FFF"/>
            { this.renderShortcut(shortcuts.rotateRight) }
          </TouchableOpacity>
        </View>
        <View style={ styles.buttons }>
          <View style={ styles.buttonGroup }>
            <TouchableOpacity
              style={ styles.controllerButton }
              onClick={ this.props.onMoveLeftPressed }
              onPress={ this.props.onMoveLeftPressed }
              disabled={ !this.props.isActive }>
              <Icon name="arrow-back" size={ 30 } color="#FFF"/>
            </TouchableOpacity>
            <TouchableOpacity
              style={ styles.controllerButton }
              onClick={ this.props.onMoveRightPressed }
              onPress={ this.props.onMoveRightPressed }
              disabled={ !this.props.isActive }>
              <Icon name="arrow-forward" size={ 30 } color="#FFF"/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={ styles.controllerFullWidthButton }
            onClick={ this.props.onDropPressed }
            onPress={ this.props.onDropPressed }
            disabled={ !this.props.isActive }>
            <Icon name="arrow-downward" size={ 30 } color="#FFF"/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerButton: {
    width: controllerButtonWidth,
    height: controllerButtonHeight,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3,
  },
  controllerFullWidthButton: {
    backgroundColor: buttonColor,
    width: controllerButtonWidth * 2 + contentsMargin,
    height: controllerButtonHeight,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3,
  },
  controllerButtonImage: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain'
  },
  shortcut: {
    color : 'white',
    fontSize: 12
  }
});
