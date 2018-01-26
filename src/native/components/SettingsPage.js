import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import SettingsList from 'react-native-settings-list';
import ModalSelector from './ModalSelector'
import _ from 'lodash';

import t from '../../shared/service/i18n';
import { themeColor, themeLightColor } from '../../shared/utils/constants';
import { configItems } from '../../shared/models/Config';

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
      return { title: t(v), value: v };
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
          title={ t(configKey) }
          itemWidth={ 70 }
          titleInfo={ t(this.props.config[configKey]) }
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
            title={ t('queueBalanceConfig') }
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
