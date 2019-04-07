import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { themeColor, themeLightColor } from "../../shared/utils/constants";
import { Navigation } from "react-native-navigation";
// @ts-ignore
import { t } from "../../shared/utils/i18n";
import { ArchiveRequestPayload } from "../../shared/utils/OnlineStorageService";

export type Props = {
  componentId: string,
  onSavePressed: (edited: ArchiveRequestPayload, isSaved: boolean) => void,

  editItem: ArchiveRequestPayload,
  isSaved: boolean
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
      // react-native-navigation のバグだと思うが、
      // setDefaultOptions の設定をここで再指定する必要がある
      sideMenu: {
        right: {
          enabled: false,
          visible: false
        }
      },
      blurOnUnmount: true
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);

    if (props.editItem) {
      this.state = {
        title: props.editItem.title
      }
    } else {
      this.state = {
        title: ''
      }
    }
  }

  handleDonePressed() {
    const title = this.state.title || 'No title';
    console.warn(this.props.editItem);
    this.props.onSavePressed({
      ...this.props.editItem,
      title
    }, this.props.isSaved);

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