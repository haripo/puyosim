import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buttonColor, contentsMargin, controllerButtonSize } from '../../shared/utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SimulatorControls extends PureComponent {
  render() {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={ styles.buttonGroup }>
          <TouchableOpacity
            disabled={ !this.props.canUndo }
            style={ styles.controllerButton }
            onPress={ this.props.onUndoSelected }>
            <Icon name="undo" size={30} color="#FFF" />
            <Text style={{ color: '#FFF' }}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={ !this.props.canRedo }
            style={ styles.controllerButton }
            onPress={ this.props.onRedoSelected }>
            <Icon name="redo" size={30} color="#FFF" />
            <Text style={{ color: '#FFF' }}>Redo</Text>
          </TouchableOpacity>
        </View>
        <View style={ styles.buttonGroup }>
          <TouchableOpacity
            style={ styles.controllerButton }
            onPress={ this.props.onRotateLeftPressed }
            disabled={ !this.props.isActive }>
            <Icon name="rotate-left" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.controllerButton }
            onPress={ this.props.onRotateRightPressed }
            disabled={ !this.props.isActive }>
            <Icon name="rotate-right" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
          <View style={ styles.buttonGroup }>
            <TouchableOpacity
              style={ styles.controllerButton }
              onPress={ this.props.onMoveLeftPressed }
              disabled={ !this.props.isActive }>
              <Icon name="arrow-back" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={ styles.controllerButton }
              onPress={ this.props.onMoveRightPressed }
              disabled={ !this.props.isActive }>
              <Icon name="arrow-forward" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={ styles.controllerFullWidthButton }
            onPress={ this.props.onDropPressed }
            disabled={ !this.props.isActive }>
            <Icon name="arrow-downward" size={30} color="#FFF" />
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
    width: controllerButtonSize,
    height: controllerButtonSize,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3,
  },
  controllerFullWidthButton: {
    backgroundColor: buttonColor,
    width: controllerButtonSize * 2 + contentsMargin,
    height: controllerButtonSize,
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
});
