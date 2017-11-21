import React, { Component } from 'react';
import { Modal, Text, StyleSheet, View, CheckBox, Button, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingsList from 'react-native-settings-list';
import ModalSelector from './ModalSelector'
import _ from 'lodash';

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
      modalVisible: _.mapValues(configItems, () => false),
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: "Settings" });
  }

  toggleModal(key) {
    let modalVisible = this.state.modalVisible;
    modalVisible[key] = !modalVisible[key];
    this.setState({ modalVisible });
  }

  renderModalSelector(configKey) {
    const values = configItems[configKey];
    const titleValues = values.map(v => {
      return { title: I18n.t(v), value: v };
    });

    return (
      <ModalSelector
        visible={ this.state.modalVisible[configKey] }
        items={ titleValues }
        selected={ this.props.config[configKey] }
        onClose={ () => this.toggleModal(configKey) }
        onChanged={ v => this.props.onChanged(configKey, v) }>
      </ModalSelector>
    );
  }

  renderConfigItem(configKey) {
      return (
        <SettingsList.Item
          title={ I18n.t(configKey) }
          itemWidth={ 70 }
          titleInfo={ I18n.t(this.props.config[configKey]) }
          titleStyle={ { color:'black', fontSize: 16 } }
          hasNavArrow={ true }
          onPress={ () => this.toggleModal(configKey) }
        />
      );
  }

  render() {
    return (
      <View style={ styles.component }>
        { this.renderModalSelector('colorBalance') }
        { this.renderModalSelector('initialColors') }
        { this.renderModalSelector('initialAllClear') }
        <SettingsList borderColor='#d6d5d9' defaultItemSize={ 50 }>
          <SettingsList.Item
            title={ I18n.t('queueBalanceConfig') }
            titleStyle={{ color:'#009688', marginBottom:10, fontWeight:'500' }}
            itemWidth={ 50 }
            hasNavArrow={ false }
            borderHide={ 'Both' }
          />
          { this.renderConfigItem('colorBalance') }
          { this.renderConfigItem('initialColors') }
          { this.renderConfigItem('initialAllClear') }
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
