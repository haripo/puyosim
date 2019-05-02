import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { buttonColor, contentsMargin, themeLightColor, } from '../utils/constants';
import Puyo from "./Puyo";
import { Layout } from "../selectors/layoutSelectors";
import IconButton from "./IconButton";

export type Props = {
  layout: Layout,
  puyoSkin: string,
  selectedItem: number,
  hasDroppingPuyo: boolean,
  onSelected: (item: number) => void,
  onPlaySelected: () => void,
  onUndoSelected: () => void,
  onResetSelected: () => void,
};

export default class EditorControls extends PureComponent<Props> {
  renderPuyoButton(puyo: number, isRight: boolean) {
    let style: any[] = [styles.controllerInactiveButton];
    if (isRight) style.push(styles.controllerRightButton);
    if (puyo === this.props.selectedItem) style.push(styles.controllerActiveButton);

    return (
      <TouchableOpacity
        style={ style }
        activeOpacity={ 0.7 }
        onPress={ () => this.props.onSelected(puyo) }>
        <Puyo puyo={ puyo } size={ 30 } skin={ this.props.puyoSkin }/>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={ styles.component }>
        <View style={ styles.buttonGroup }>
          <IconButton
            style={ styles.controllerFullWidthButton }
            disabled={ !this.props.hasDroppingPuyo }
            icon='play-arrow'
            text='play'
            onPressed={ this.props.onPlaySelected }
            shortcutText={ '' }
          />
        </View>
        <View style={ styles.buttonGroup }>
          <IconButton
            style={ [styles.controllerButton] }
            disabled={ false }
            icon='undo'
            text='undo'
            onPressed={ this.props.onUndoSelected }
            shortcutText={ '' }
          />
          <IconButton
            style={ [styles.controllerButton, styles.controllerRightButton] }
            disabled={ false }
            icon='fast-rewind'
            text='reset'
            onPressed={ this.props.onResetSelected }
            shortcutText={ '' }
          />
        </View>
        <View style={ styles.buttonGroup }>
          { this.renderPuyoButton(1, false) }
          { this.renderPuyoButton(2, true) }
        </View>
        <View style={ styles.buttonGroup }>
          { this.renderPuyoButton(3, false) }
          { this.renderPuyoButton(4, true) }
        </View>
        <View style={ styles.buttonGroup }>
          { this.renderPuyoButton(5, false) }
          { this.renderPuyoButton(0, true) }
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
  controllerButton: {
    flex: 1,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3,
  },
  controllerInactiveButton: {
    flex: 1,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeLightColor,
    borderColor: buttonColor,
    borderWidth: 1,
    borderRadius: 3,
    elevation: 3,
  },
  controllerActiveButton: {
    backgroundColor: buttonColor,
  },
  controllerRightButton: {
    marginLeft: contentsMargin
  },
  controllerFullWidthButton: {
    flex: 1,
    backgroundColor: buttonColor,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3,
  },
});
