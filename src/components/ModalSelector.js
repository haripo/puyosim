import React, { Component } from 'react';
import { Modal, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsList from 'react-native-settings-list';

export default class SettingsPage extends Component {
  constructor() {
    super();
  }

  close() {
    this.props.onClose(null);
  }

  renderItem(itemOption) {
    let icon = null;
    if (itemOption.value == this.props.selected) {
      icon = (
        <Icon name="check" size={30} color="green" style={ { top: 20 , left: 20, width: 50 } }/>
      )
    } else {
      icon = (
        <View style={ { top: 20 , left: 20, width: 50 } }/>
      )
    }

    return (
      <SettingsList.Item
        title={ itemOption.title }
        itemWidth={ 70 }
        icon={ icon }
        titleStyle={ { color:'black', fontSize: 16 } }
        onPress={ () => this.handleChange(itemOption) }
        hasNavArrow={ false }
        borderHide={ 'Both' }
        key={ itemOption.value }/>
    )
  }

  handleChange(option) {
    this.props.onChanged(option.value);
    this.close();
  }

  render() {
    const { visible, items } = this.props;
    return (
      <Modal
        transparent={ true }
        visible={ visible }
        onRequestClose={ ::this.close }
        animationType="fade">
        <TouchableWithoutFeedback onPress={ ::this.close }>
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'}}>
            <View style={{　backgroundColor: 'white', width: 300 }}>
              <SettingsList borderColor='#d6d5d9' defaultItemSize={ 50 }>
                { items.map(item => this.renderItem(item)) }
              </SettingsList>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    alignItems: 'stretch'
  }
});
