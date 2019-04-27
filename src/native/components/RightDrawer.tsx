import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { contentsMargin, contentsPadding, themeLightColor } from "../../shared/utils/constants";
import IconButton from "../../shared/components/IconButton";
import * as _ from "lodash";
import { NavigationScreenProps } from "react-navigation";
// @ts-ignore
import t from '../../shared/utils/i18n';
// @ts-ignore
import { ArchiveRequestPayload } from "../../shared/utils/OnlineStorageService";

export type Props = NavigationScreenProps & {
  score: number,
  chainScore: number,
  numHands: number,
  numSplit: number,
  chain: number,

  isSaved: boolean,
  archivePayload: ArchiveRequestPayload

  onResetSelected: () => void,
  onRestartSelected: () => void,
  onSaveCopySelected: () => void,
  onOverwriteArchiveSelected: (archive: ArchiveRequestPayload) => void
}

type State = {}

export default class RightDrawer extends Component<Props, State> {

  private closeDrawer() {
    this.props.navigation.closeDrawer();
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
    this.props.navigation.push('history');
  }

  handleShareSelected() {
    this.closeDrawer();
    this.props.navigation.push('share');
  }

  handleSavePressed() {
    this.closeDrawer();
    if (this.props.isSaved) {
      Alert.alert(
        'Overwrite?',
        ``,
        [
          {
            text: 'Overwrite',
            onPress: () => {
              this.props.onOverwriteArchiveSelected(this.props.archivePayload);
            }
          },
          {
            text: 'Save a copy',
            onPress: () => {
              this.props.onSaveCopySelected(); // playId を更新する
              this.props.navigation.push('saveModal', {
                editItem: this.props.archivePayload
              });
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
            },
            style: 'cancel',
          },
        ],
        {
          cancelable: false
        },
      );
    } else {
      this.props.navigation.push('saveModal', {
        editItem: this.props.archivePayload
      });
    }
  }

  handleLoadPressed() {
    this.closeDrawer();
    this.props.navigation.push('archive');
  }

  handleEditPressed() {
    this.closeDrawer();
    this.props.navigation.push('editor');
  }

  handleSettingsSelected() {
    this.closeDrawer();
    this.props.navigation.push('settings');
  }

  handleAboutSelected() {
    this.closeDrawer();
    this.props.navigation.push('about');
  }

  renderMetric({ name, value }) {
    return (
      <View style={ styles.metricItem } key={ name }>
        <View style={ styles.metricKey }>
          <Text style={ styles.metricText }>
            { name }
          </Text>
        </View>
        <View style={ styles.metricValue }>
          <Text style={ styles.metricText }>
            { value }
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const metrics = [
      { name: t('numChain'), value: this.props.chain },
      { name: t('chainScore'), value: this.props.chainScore },
      { name: t('totalScore'), value: this.props.score },
      { name: t('numHands'), value: this.props.numHands },
      { name: t('numSplit'), value: this.props.numSplit },
    ];

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={ styles.container }>
          <View style={ styles.metrics }>
            { metrics.map(m => this.renderMetric(m)) }
          </View>
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
              <IconButton
                style={ styles.controllerRightButton }
                icon='delete'
                text='restart'
                onPressed={ this.handleRestartSelected.bind(this) }
              />
            </View>
            <View style={ styles.buttonGroup }>
              <IconButton
                icon='edit'
                text='edit'
                onPressed={ this.handleEditPressed.bind(this) }
              />
              <IconButton
                style={ styles.controllerRightButton }
                icon='cloud-upload'
                text='save'
                onPressed={ this.handleSavePressed.bind(this) }
              />
              <IconButton
                style={ styles.controllerRightButton }
                icon='cloud-download'
                text='load'
                onPressed={ this.handleLoadPressed.bind(this) }
              />
            </View>
            <View style={ styles.buttonGroup }>
              <IconButton
                icon='share'
                text='share'
                onPressed={ this.handleShareSelected.bind(this) }
              />
              <IconButton
                style={ styles.controllerRightButton }
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
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: contentsPadding,
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
  },
  metrics: {
    padding: contentsPadding
  },
  metricItem: {
    marginBottom: contentsPadding,
    display: 'flex',
    flexDirection: 'row'
  },
  metricKey: {
    flex: 1,
    padding: contentsPadding,
    marginRight: contentsPadding
  },
  metricValue: {
    flex: 1,
    backgroundColor: themeLightColor,
    padding: contentsPadding
  },
  metricText: {
    textAlign: 'right'
  }
});