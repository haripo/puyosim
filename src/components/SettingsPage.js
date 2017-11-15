import React, { Component } from 'react';
import { Modal, Text, StyleSheet, View, CheckBox, Button, Picker } from 'react-native';
import I18n from '../utils/i18n';
import { themeColor, themeLightColor } from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SettingsList from 'react-native-settings-list';
import ModalSelector from './ModalSelector'

export default class SettingsPage extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  colorBalanceConfig = [
    {
      title: '128 手で均等',
      value: 128
    },
    {
      title: '16 手で均等',
      value: 16
    }
  ]

  initialColorsConfig = [
    {
      title: '制限なし',
      value: 0
    },
    {
      title: '初手 3 手で 4 色のツモを禁止',
      value: 1
    }
  ]

  initialAllClearConfig = [
    {
      title: '制限なし',
      value: 0
    },
    {
      title: '初手 2 手で全消しのツモを禁止',
      value: 1
    }
  ]

  constructor() {
    super();
    this.state = {
      colorBalance: 128,
      initialColors: 0,
      initialAllClear: 0,
      balanceModalVisible: false,
      colorsModalVisible: false,
      allClearModalVisible: false
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: "Settings" });
  }

  handleColorBalanceChanged(value) {
    this.setState({ colorBalance: value });
  }

  handleInitialColorsChanged(value) {
    this.setState({ initialColors: value });
  }

  handleInitialAllClearChanged(value) {
    this.setState({ initialAllClear: value });
  }

  render() {
    return (
      <View style={ styles.component }>
        <ModalSelector
          visible={ this.state.balanceModalVisible }
          items={ this.colorBalanceConfig }
          selected={ this.state.colorBalance }
          onClose={ () => this.setState({ balanceModalVisible: false }) }
          onChanged={ ::this.handleColorBalanceChanged }>
        </ModalSelector>
        <ModalSelector
          visible={ this.state.colorsModalVisible }
          items={ this.initialColorsConfig }
          selected={ this.state.initialColors }
          onClose={ () => this.setState({ colorsModalVisible: false }) }
          onChanged={ ::this.handleInitialColorsChanged }>
        </ModalSelector>
        <ModalSelector
          visible={ this.state.allClearModalVisible }
          items={ this.initialAllClearConfig }
          selected={ this.state.initialAllClear }
          onClose={ () => this.setState({ allClearModalVisible: false }) }
          onChanged={ ::this.handleInitialAllClearChanged }>
        </ModalSelector>
        <SettingsList borderColor='#d6d5d9' defaultItemSize={ 50 }>
          <SettingsList.Item
            title='ツモ補正'
            titleStyle={{ color:'#009688', marginBottom:10, fontWeight:'500' }}
            itemWidth={ 50 }
            hasNavArrow={ false }
            borderHide={ 'Both' }
          />
          <SettingsList.Item
            title='配色補正'
            itemWidth={ 70 }
            titleInfo={ this.colorBalanceConfig.find(v => v.value === this.state.colorBalance).title }
            titleStyle={ { color:'black', fontSize: 16 } }
            hasNavArrow={ true }
            onPress={ () => this.setState({ balanceModalVisible: true }) }
          />
          <SettingsList.Item
            title='初手制限'
            itemWidth={ 70 }
            titleInfo={ this.initialColorsConfig.find(v => v.value === this.state.initialColors).title }
            titleStyle={ { color:'black', fontSize: 16 } }
            hasNavArrow={ true }
            onPress={ () => this.setState({ colorsModalVisible: true }) }
          />
          <SettingsList.Item
            title='全消し制限'
            itemWidth={ 70 }
            titleInfo={ this.initialAllClearConfig.find(v => v.value === this.state.initialAllClear).title }
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
