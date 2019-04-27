import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { buttonColor, contentsMargin, themeLightColor, } from '../utils/constants';
import Puyo from "./Puyo";
import { Layout } from "../selectors/layoutSelectors";

export type Props = {
  layout: Layout,
  puyoSkin: string,
  selectedItem: number,
  onSelected: (item: number) => void,
};

export default class EditorControls extends PureComponent<Props> {
  renderPuyoButton(puyo: number, isRight: boolean) {
    let style: any[] = [styles.controllerButton];
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
