import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from "react-navigation";
import { themeLightColor } from "../../shared/utils/constants";
import { t } from "../../shared/platformServices/i18n";
import { ArchiveRequestPayload } from "../../types";

export type Props = {
  componentId: string,
  onSavePressed: (edited: ArchiveRequestPayload, isSaved: boolean) => void,

  editItem: ArchiveRequestPayload,
  isSaved: boolean
}

type State = {
  title: string
}

type Params = {
  editItem: ArchiveRequestPayload,
  handleDonePressed: () => void
}

export default class SaveModal extends Component<Props & NavigationScreenProps<Params>, State> {
  static navigationOptions = ({ navigation }) => ({
    title: t('saveArchive'),
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={ navigation.state.params.handleDonePressed }
      >
        <Text style={{ color: themeLightColor }}>{ t('saveModalDone').toUpperCase() }</Text>
      </TouchableOpacity>
    )
  });

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    navigation.setParams({
      handleDonePressed: this.handleDonePressed.bind(this)
    });

    const { params } = navigation.state;
    if (params === undefined) {
      throw '';
    }

    if (params.editItem) {
      this.state = {
        title: params.editItem.title
      }
    } else {
      this.state = {
        title: ''
      }
    }
  }

  handleDonePressed() {
    const title = this.state.title || 'No title';
    const params = this.props.navigation.state.params;
    const editItem = params ? params['editItem'] : {};
    // @ts-ignore
    this.props.onSavePressed({
      ...editItem,
      title
    }, this.props.isSaved);

    // TODO: show loading indicator
    this.props.navigation.pop();
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