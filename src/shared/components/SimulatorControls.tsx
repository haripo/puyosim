import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { contentsMargin, } from '../utils/constants';
import _ from 'lodash';
import IconButton from "./IconButton";

export type Props = {
  shortcuts?: { [key: string]: string },
  canUndo: boolean,
  canRedo: boolean,
  isActive: boolean,
  onUndoSelected: () => void,
  onRedoSelected: () => void,
  onRotateLeftPressed: () => void,
  onRotateRightPressed: () => void,
  onMoveLeftPressed: () => void,
  onMoveRightPressed: () => void,
  onDropPressed: () => void
};

export default class SimulatorControls extends PureComponent<Props> {
  render() {
    const shortcuts = _.mapValues(this.props.shortcuts || {}, (shortcut) => `(${shortcut})`);

    return (
      <View style={ styles.component }>
        <View style={ styles.buttonGroup }>
          <IconButton
            disabled={ !this.props.canUndo }
            icon='undo'
            text='undo'
            onPressed={ this.props.onUndoSelected }
            shortcutText={ shortcuts.undo }
          />
          <IconButton
            style={ styles.controllerRightButton }
            disabled={ !this.props.canRedo }
            icon='redo'
            text='redo'
            onPressed={ this.props.onRedoSelected }
            shortcutText={ shortcuts.redo }
          />
        </View>
        <View style={ styles.buttonGroup }>
          <IconButton
            disabled={ !this.props.isActive }
            icon='rotate-left'
            onPressed={ this.props.onRotateLeftPressed }
            shortcutText={ shortcuts.rotateLeft }
          />
          <IconButton
            style={ styles.controllerRightButton }
            disabled={ !this.props.isActive }
            icon='rotate-right'
            onPressed={ this.props.onRotateRightPressed }
            shortcutText={ shortcuts.rotateRight }
          />
        </View>
        <View style={ styles.buttonGroup }>
          <IconButton
            disabled={ !this.props.isActive }
            icon='arrow-back'
            onPressed={ this.props.onMoveLeftPressed }
          />
          <IconButton
            style={ styles.controllerRightButton }
            disabled={ !this.props.isActive }
            icon='arrow-forward'
            onPressed={ this.props.onMoveRightPressed }
          />
        </View>
        <View style={ styles.buttonGroup }>
          <IconButton
            disabled={ !this.props.isActive }
            icon='arrow-downward'
            onPressed={ this.props.onDropPressed }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'column',
    height: 300
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerRightButton: {
    marginLeft: contentsMargin
  }
});
