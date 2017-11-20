import React, { Component } from 'react';
import { Modal, Text, StyleSheet, View, CheckBox, Button, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsList from 'react-native-settings-list';
import ModalSelector from './ModalSelector'

import I18n from '../utils/i18n';
import { themeColor, themeLightColor } from '../utils/constants';
import { configItems } from '../models/Config';

export default class SettingsPage extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor() {
    super();
    this.state = {
      balanceModalVisible: false,
      colorsModalVisible: false,
      allClearModalVisible: false
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: "Settings" });
  }

  handleColorBalanceChanged(value) {
    this.props.onChanged('colorBalance', value);
  }

  handleInitialColorsChanged(value) {
    this.props.onChanged('initialColors', value);
  }

  handleInitialAllClearChanged(value) {
    this.props.onChanged('initialAllClear', value);
  }

  render() {
    const { config } = this.props;
    const mapToTitleValue = list => list.map(v => {
      return { title: I18n.t(v), value: v };
    });

    return (
      <View style={ styles.component }>
        <ModalSelector
          visible={ this.state.balanceModalVisible }
          items={ mapToTitleValue(configItems.colorBalance) }
          selected={ config.colorBalance }
          onClose={ () => this.setState({ balanceModalVisible: false }) }
          onChanged={ ::this.handleColorBalanceChanged }>
        </ModalSelector>
        <ModalSelector
          visible={ this.state.colorsModalVisible }
          items={ mapToTitleValue(configItems.initialColors) }
          selected={ config.initialColors }
          onClose={ () => this.setState({ colorsModalVisible: false }) }
          onChanged={ ::this.handleInitialColorsChanged }>
        </ModalSelector>
        <ModalSelector
          visible={ this.state.allClearModalVisible }
          items={ mapToTitleValue(configItems.initialAllClear) }
          selected={ config.initialAllClear }
          onClose={ () => this.setState({ allClearModalVisible: false }) }
          onChanged={ ::this.handleInitialAllClearChanged }>
        </ModalSelector>
        <SettingsList borderColor='#d6d5d9' defaultItemSize={ 50 }>
          <SettingsList.Item
            title={ I18n.t('queueBalanceConfig') }
            titleStyle={{ color:'#009688', marginBottom:10, fontWeight:'500' }}
            itemWidth={ 50 }
            hasNavArrow={ false }
            borderHide={ 'Both' }
          />
          <SettingsList.Item
            title={ I18n.t('colorBalance') }
            itemWidth={ 70 }
            titleInfo={ I18n.t(config.colorBalance) }
            titleStyle={ { color:'black', fontSize: 16 } }
            hasNavArrow={ true }
            onPress={ () => this.setState({ balanceModalVisible: true }) }
          />
          <SettingsList.Item
            title={ I18n.t('initialColors') }
            itemWidth={ 70 }
            titleInfo={ I18n.t(config.initialColors) }
            titleStyle={ { color:'black', fontSize: 16 } }
            hasNavArrow={ true }
            onPress={ () => this.setState({ colorsModalVisible: true }) }
          />
          <SettingsList.Item
            title={ I18n.t('initialAllClear') }
            itemWidth={ 70 }
            titleInfo={ I18n.t(config.initialAllClear) }
            titleStyle={ { color:'black', fontSize: 16 } }
            hasNavArrow={ true }
            onPress={ () => this.setState({ allClearModalVisible: true }) }
          />
        </SettingsList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    alignItems: 'stretch'
  }
});
