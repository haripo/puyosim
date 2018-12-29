import _ from 'lodash';
import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { themeColor, themeLightColor } from "../../shared/utils/constants";
import { Navigation } from "react-native-navigation";
import { ArchivedPlay } from "../../shared/utils/StorageService.native";

// @ts-ignore
import { t } from "../../shared/utils/i18n";

export type Props = {
  componentId: string,
  onSavePressed: (play: ArchivedPlay) => void,

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
        title: props.editItem.title
      }
    } else {
      this.state = {
        title: ''
      }
    }
  }

  handleDonePressed() {
    let play = _.cloneDeep(this.props.editItem || {}) as ArchivedPlay;
    play.title = this.state.title || 'No title';
    this.props.onSavePressed(play);

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