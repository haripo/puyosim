import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { themeColor, themeLightColor } from "../../shared/utils/constants";
import { Navigation } from "react-native-navigation";

export type Props = {
  componentId: string,
  onSavePressed: (title: string) => void,
}

type State = {
  title: string
}

export default class SaveModal extends Component<Props, State> {

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Save field', // TODO: i18n
          color: themeLightColor
        },
        background: {
          color: themeColor
        },
        backButton: {
          color: 'white'
        },
        rightButtons: [
          {
            id: 'save-done',
            color: 'white',
            text: 'DONE'
          }
        ],
      },
      layout: {
        orientation: 'portrait'
      }
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      title: ''
    }
  }

  handleDonePressed() {
    this.props.onSavePressed(this.state.title || 'No title');
    // TODO: show loading indicator
    Navigation.pop(this.props.componentId);
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'save-done':
        this.handleDonePressed();
        break;
    }
  }

  handleTitleChanged(value) {
    this.setState({
      title: value
    })
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text>
          Title
        </Text>
        <TextInput
          placeholder={ 'タイトル' }
          style={ styles.titleInput }
          value={ this.state.title }
          onChangeText={ this.handleTitleChanged.bind(this) }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  titleInput: {
    fontSize: 20
  }
});