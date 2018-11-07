import * as _ from 'lodash';
import React, { Component } from 'react';
import { ActionSheetIOS, Alert, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { parse } from 'query-string';
import { Navigation } from "react-native-navigation";
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import {
  contentsMargin,
  themeColor,
  themeLightColor
} from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';

// @ts-ignore
import t from '../../shared/utils/i18n';
import {
  PendingPairPuyo,
  PendingPair,
  StackForRendering
} from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen';


export type Props = {
  componentId: string,

  stack: StackForRendering,
  ghosts: PendingPairPuyo[],
  pendingPair: PendingPair,
  droppings: DroppingPlan[],
  vanishings: VanishingPlan[],

  puyoSkin: string,
  layout: Layout,
  theme: Theme,

  isActive: boolean,
  canUndo: boolean,
  canRedo: boolean,

  onUndoSelected: () => void,
  onRedoSelected: () => void,
  onResetSelected: () => void,
  onRestartSelected: () => void,
  onShareSelected: () => void,
  onRotateLeftPressed: () => void,
  onRotateRightPressed: () => void,
  onMoveLeftPressed: () => void,
  onMoveRightPressed: () => void,
  onDropPressed: () => void,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void,
  onReconstructHistoryRequested: (history: string, queue: string, index: number) => void,
}

type State = {
  isVisible: boolean
}

export default class Simulator extends Component<Props, State> {

  static options(passProps) {
    switch (Platform.OS) {
      case 'ios':
        return {
          topBar: {
            title: {
              text: 'puyosim',
              color: themeLightColor
            },
            background: {
              color: themeColor
            },
            backButton: {
              color: 'white'
            }
          },
          layout: {
            orientation: 'portrait'
          }
        };
      case 'android':
        return {
          topBar: {
            title: {
              text: 'puyosim',
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
                text: t('about'),
                id: 'about',
                showAsAction: 'never',
              },
              {
                text: t('settings'),
                id: 'settings',
                showAsAction: 'never'
              },
              {
                text: t('archive'),
                id: 'archive',
                showAsAction: 'never'
              },
              {
                text: t('shareViaTwitter'),
                id: 'share-via-ips',
                showAsAction: 'never'
              },
              {
                text: t('restart'),
                id: 'restart',
                showAsAction: 'never'
              },
              {
                text: t('reset'),
                id: 'reset',
                showAsAction: 'never'
              },
              {
                text: t('history'),
                id: 'history',
                showAsAction: 'never'
              },
              {
                text: t('undo'),
                id: 'undo',
                showAsAction: 'never'
              }
            ]
          },
          layout: {
            orientation: 'portrait'
          }
        }
    }
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      isVisible: true
    }
  }

  private launchViewer(url) {
    if (!url) {
      return
    }

    const query = parse(url.split('?')[1]);
    if ('q' in query && 'h' in query) {
      this.props.onReconstructHistoryRequested(
        query['h'],
        query['q'],
        'i' in query ? parseInt(query['i']) : 0,
      )
    }

    Navigation.push(this.props.componentId, {
      component: { name: 'com.puyosimulator.Viewer' }
    });
  }

  componentDidMount() {
    // SplashScreen.hide();

    firebase.links()
      .getInitialLink()
      .then((url) => {
        this.launchViewer(url);
      });

    firebase.links()
      .onLink(url => {
        Alert.alert(
          'Open URL',
          t('openInExistingAppAlert'),
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => this.launchViewer(url)
            },
          ],
          { cancelable: false }
        );
      });
  }

  navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case 'undo':
        this.props.onUndoSelected();
        break;
      case 'reset':
        this.props.onResetSelected();
        break;
      case 'restart':
        Alert.alert(
          t('restart'),
          t('confirmRestart'),
          [
            { text: 'Cancel', onPress: _.noop, style: 'cancel' },
            { text: 'OK', onPress: this.props.onRestartSelected }
          ],
          { cancelable: false }
        );
        break;
      case 'history':
        Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.History' } });
        break;
      case 'share-via-ips':
        //this.props.onShareSelected();
        Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Share' } });
        break;
      case 'settings':
        Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Settings' } });
        break;
      case 'about':
        Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.About' } });
        break;
      case 'archive':
        Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Archive' } });
        break;
      case 'menu':
        ActionSheetIOS.showActionSheetWithOptions({
          options: [
            'Cancel',
            'Undo',
            'Reset',
            'Restart',
            'History',
            'Share',
            'Settings',
            'Archive',
            'About'
          ],
          destructiveButtonIndex: 0
        }, selected => {
          [
            () => {
            },
            this.props.onUndoSelected,
            this.props.onResetSelected,
            () => Alert.alert(
              t('restart'),
              t('confirmRestart'),
              [
                { text: 'Cancel', onPress: _.noop, style: 'cancel' },
                { text: 'OK', onPress: this.props.onRestartSelected }
              ],
              { cancelable: false }
            ),
            () => Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.History' } }),
            () => Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Share' } }),
//              this.props.onShareSelected,
            () => Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Settings' } }),
            () => Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.Archive' } }),
            () => Navigation.push(this.props.componentId, { component: { name: 'com.puyosimulator.About' } }),
          ][selected]()
        });
        break;
    }
  }

  componentDidAppear() {
    this.setState({ isVisible: true });
  }

  componentDidDisappear() {
    this.setState({ isVisible: false });
  }

  render() {
    return (
      <LayoutBaseContainer>
        <View
          style={ styles.container }>
          <View style={ styles.contents }>
            <View>
              <HandlingPuyos
                pair={ this.props.pendingPair }
                puyoSkin={ this.props.puyoSkin }
                style={ styles.handlingPuyos as ViewStyle }
                layout={ this.props.layout }>
              </HandlingPuyos>
              <Field
                stack={ this.props.stack }
                ghosts={ this.props.ghosts }
                isActive={ this.props.isActive }
                droppings={ this.props.droppings }
                vanishings={ this.props.vanishings }
                style={ styles.field }
                layout={ this.props.layout }
                theme={ this.props.theme }
                puyoSkin={ this.props.puyoSkin }
                onDroppingAnimationFinished={ this.state.isVisible ? this.props.onDroppingAnimationFinished : undefined }
                onVanishingAnimationFinished={ this.state.isVisible ? this.props.onVanishingAnimationFinished : undefined }
              />
              { /*
                this.state.isiVisible == false のとき、
                このコンポーネントは history 画面などの screen によって隠されている。
                その場合、アニメーション完了時のコールバックが history 画面のものとあわせて
                2 回発行されてしまうため、それを防ぐ。
               */ }
            </View>
            <View style={ styles.side }>
              <View style={ styles.sideHead }>
                <NextWindowContainer/>
                <ChainResultContainer/>
              </View>
              <SimulatorControls
                onUndoSelected={ this.props.onUndoSelected }
                onRedoSelected={ this.props.onRedoSelected }
                onRotateLeftPressed={ this.props.onRotateLeftPressed }
                onRotateRightPressed={ this.props.onRotateRightPressed }
                onMoveLeftPressed={ this.props.onMoveLeftPressed }
                onMoveRightPressed={ this.props.onMoveRightPressed }
                onDropPressed={ this.props.onDropPressed }
                isActive={ this.props.isActive }
                canUndo={ this.props.canUndo }
                canRedo={ this.props.canRedo }
              />
            </View>
          </View>
        </View>
      </LayoutBaseContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5'
  },
  contents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  handlingPuyos: {
    marginTop: 3,
    marginLeft: 3,
  },
  side: {
    flex: 1,
    marginRight: contentsMargin,
    marginBottom: contentsMargin
  },
  sideHead: {
    flex: 1
  },
  field: {
    margin: contentsMargin
  }
});
