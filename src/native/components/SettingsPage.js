import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SettingsList from 'react-native-settings-list';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import t from '../../shared/service/i18n';
import { themeColor, themeLightColor } from '../../shared/utils/constants';
import { configCategoryItem, configItems } from '../../shared/models/Config';

export default class SettingsPage extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor() {
    super();
  }

  componentDidMount() {
    const { configKey } = this.props;
    const title = configKey ? t(configKey) : "Settings";
    this.props.navigator.setTitle({ title });
  }

  openDescendantScreen(key) {
    this.props.navigator.push({
      screen: 'com.puyosimulator.Settings',
      passProps: {
        configKey: key,
        menu: (this.props.menu || configItems)[key]
      }
    });
  }

  updateConfigValue(value) {
    const { onChanged, configKey } = this.props;
    onChanged(configKey, value);
  }

  renderSelectChild(configValue) {
    let icon = null;
    if (configValue === this.props.config[this.props.configKey]) {
      icon = (
        <Icon name="check" size={30} color="green" style={ { top: 20 , left: 20, width: 50 } }/>
      );
    } else {
      icon = (
        <View style={ { top: 20 , left: 20, width: 50 } }/>
      )
    }

    return (
      <SettingsList.Item
        title={ configValue }
        key={configValue}
        icon={ icon }
        itemWidth={ 70 }
        titleStyle={ { color:'black', fontSize: 16 } }
        hasNavArrow={ false }
        onPress={ () => {
          this.updateConfigValue(configValue);
          this.props.navigator.pop();
        } }
      />
    );
  }

  renderSelectChild2(configValue) {
    let icon = null;
    if (configValue === this.props.config[this.props.configKey]) {
      icon = (
        <Icon name="check" size={30} color="green" style={ { top: 20 , left: 20, width: 50 } }/>
      );
    } else {
      icon = (
        <View style={ { top: 20 , left: 20, width: 50 } }/>
      )
    }

    return (
      <SettingsList.Item
        title={ configValue }
        key={configValue}
        icon={ icon }
        itemWidth={ 70 }
        titleStyle={ { color:'black', fontSize: 16 } }
        titleInfo={ this.props.config[configValue] }
        hasNavArrow={ true }
        onPress={ () => {
          this.updateConfigValue(configValue);
          this.openDescendantScreen(configValue);
        } }
      />
    );
  }

  renderSelectParent(configKey) {
    return (
      <SettingsList.Item
        title={ t(configKey) }
        key={configKey}
        itemWidth={ 70 }
        titleInfo={ this.props.config[configKey] }
        titleStyle={ { color:'black', fontSize: 16 } }
        hasNavArrow={ true }
        onPress={ () => this.openDescendantScreen(configKey) }
      />
    );
  }

  /**
   * Render config menu
   * @param menu config object
   * @returns {Array} vDOM nodes
   */
  renderConfigItems(menu) {
    return _.map(menu, (v, k) => {
      if (configCategoryItem.has(k)) {
        return this.renderSelectParent(k);
      } else if (v === null) {
        return this.renderSelectChild(k);
      } else {
        return this.renderSelectChild2(k);
      }
    });
  }

  render() {
    return (
      <View style={ styles.component }>
        <SettingsList borderColor='#d6d5d9' defaultItemSize={ 50 }>
          { this.renderConfigItems(this.props.menu || configItems) }
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
