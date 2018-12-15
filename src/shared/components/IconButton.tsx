import React, { Component } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { buttonColor, contentsMargin } from "../utils/constants";

export type Props = {
  disabled?: boolean,
  icon: string,
  text?: string,
  shortcutText?: string,
  onPressed: () => void,
  onLongPressed?: () => void,
  style?: any
}

type State = {}

export default class IconButton extends Component<Props, State> {
  renderText(text) {
    if (text) {
      return (
        <Text style={ { color: '#FFF' } }>{ text }</Text>
      );
    }
    return null;
  }

  renderShortcut(key) {
    if (key) {
      return (
        <Text style={ styles.shortcut }>{ key }</Text>
      )
    }
    return null;
  }

  render() {
    const {
      style, text, icon, shortcutText,
      disabled, onPressed, onLongPressed } = this.props;
    return (
      <TouchableOpacity
        disabled={ disabled }
        style={ [styles.button, style] }
        activeOpacity={ !disabled ? 0.7 : 1 }
        onPress={ disabled ? () => {} : onPressed }
        onLongPress={ disabled ? () => {} : onLongPressed }>
        <Icon name={ icon } size={ 30 } color="#FFF"/>
        { this.renderText(text) }
        { this.renderShortcut(shortcutText) }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3
  },
  shortcut: {
    color: 'white',
    fontSize: 12
  }
});