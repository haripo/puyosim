import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { themeColor, themeLightColor } from "../../shared/utils/constants";
import { Navigation } from "react-native-navigation";
import { ArchivedPlay } from "../../shared/utils/StorageService.native";

// @ts-ignore
import { t } from "../../shared/utils/i18n";

export type Props = {
  componentId: string,
  onSavePressed: (id: string | null, title: string) => void,

  editItem: ArchivedPlay | undefined,
}

type State = {
  title: string
}

export default class SaveModal extends Component<Props, State> {

  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: t('saveArchive'),
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
            text: t('saveModalDone')
          }
        ]
      },
      layout: {
        orientation: 'portrait'
      },
      blurOnUnmount: true
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);

    if (props.editItem) {
      this.state = {
        title: props.editItem.title.toString() // realm オブジェクトを文字列に直す
      }
    } else {
      this.state = {
        title: ''
      }
    }
  }

  handleDonePressed() {
    this.props.onSavePressed(
      this.props.editItem ? this.props.editItem.id : null,
      this.state.title || 'No title'
    );

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
          { t('saveModalTitle') }
        </Text>
        <TextInput
          placeholder={ t('saveModalTitlePlaceholder') }
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