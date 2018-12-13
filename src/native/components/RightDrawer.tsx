import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { contentsMargin, contentsPadding } from "../../shared/utils/constants";
import IconButton from "../../shared/components/IconButton";
import { Navigation } from "react-native-navigation";
import * as _ from "lodash";

// @ts-ignore
import t from '../../shared/utils/i18n';

export type Props = {
  componentId: string,

  onResetSelected: () => void,
  onRestartSelected: () => void,
  onShareSelected: () => void,
}

type State = {}

export default class RightDrawer extends Component<Props, State> {

  private closeDrawer() {
    Navigation.mergeOptions('sideMenu', {
      sideMenu: {
        right: {
          visible: false
        }
      }
    });
  }

  handleResetSelected() {
    this.closeDrawer();
    this.props.onResetSelected();
  }

  handleRestartSelected() {
    this.closeDrawer();
    Alert.alert(
      t('restart'),
      t('confirmRestart'),
      [
        { text: 'Cancel', onPress: _.noop, style: 'cancel' },
        { text: 'OK', onPress: this.props.onRestartSelected }
      ],
      { cancelable: false }
    );
  }

  handleHistoryPressed() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.History' }
    });
  }

  handleShareSelected() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.Share' }
    });
  }

  handleSavePressed() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.SaveModal' }
    });
  }

  handleLoadPressed() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.Archive' }
    });
  }

  handleSettingsSelected() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.Settings' }
    });
  }

  handleAboutSelected() {
    this.closeDrawer();
    Navigation.push('centerStack', {
      component: { name: 'com.puyosimulator.About' }
    });
  }

  render() {
    return (
      <View style={ [styles.container, Platform.OS === 'ios' ? { width: 200 } : null] }>
        <Text>
          hoge
        </Text>
        <View style={ styles.buttons }>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='history'
              text='history'
              onPressed={ this.handleHistoryPressed.bind(this) }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='fast-rewind'
              text='reset'
              onPressed={ this.handleResetSelected.bind(this) }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='delete'
              text='restart'
              onPressed={ this.handleRestartSelected.bind(this) }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='share'
              text='share'
              onPressed={ this.handleShareSelected.bind(this) }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='archive'
              text='save'
              onPressed={ this.handleSavePressed.bind(this) }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='unarchive'
              text='load'
              onPressed={ this.handleLoadPressed.bind(this) }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='settings'
              text='settings'
              onPressed={ this.handleSettingsSelected.bind(this) }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='feedback'
              text='about'
              onPressed={ this.handleAboutSelected.bind(this) }
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: contentsPadding
  },
  buttons: {
    flexDirection: 'column',
    height: 300 // SimulatorControls の component.height の半分
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerRightButton: {
    marginLeft: contentsMargin
  }
});