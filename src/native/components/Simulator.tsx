import * as _ from 'lodash';
import React, { Component } from 'react';
import { ActionSheetIOS, Alert, Platform, StyleSheet, View } from 'react-native';
import { Navigator } from "react-native-navigation";
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

export type Props = {
  navigator: Navigator,

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
  onVanishingAnimationFinished: () => void
}

export default class Simulator extends Component<Props, {}> {

  static navigatorButtons = {};

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.props.navigator.setTitle({ title: "puyosim" });
  }

  componentDidMount() {
    //this.props.onSimulatorLaunched();
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
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
          this.props.navigator.push({ screen: 'com.puyosimulator.History' });
          break;
        case 'share-via-ips':
          this.props.onShareSelected();
          break;
        case 'settings':
          this.props.navigator.push({ screen: 'com.puyosimulator.Settings' });
          break;
        case 'about':
          this.props.navigator.push({ screen: 'com.puyosimulator.About' });
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
              'About'
            ],
            destructiveButtonIndex: 0
          }, selected => {
            [
              () => {},
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
              () => this.props.navigator.push({ screen: 'com.puyosimulator.History' }),
              this.props.onShareSelected,
              () => this.props.navigator.push({ screen: 'com.puyosimulator.Settings' }),
              () => this.props.navigator.push({ screen: 'com.puyosimulator.About' })
            ][selected]()
          });
          break;
      }
    }
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
                style={ styles.handlingPuyos }
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
                onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
                onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
              >
              </Field>
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

if (Platform.OS === 'android') {
  Simulator.navigatorButtons = {
    rightButtons: [
      {
        title: t('about'),
        id: 'about',
        showAsAction: 'never'
      },
      {
        title: t('settings'),
        id: 'settings',
        showAsAction: 'never'
      },
      {
        title: t('shareViaTwitter'),
        id: 'share-via-ips',
        showAsAction: 'never'
      },
      {
        title: t('restart'),
        id: 'restart',
        showAsAction: 'never'
      },
      {
        title: t('reset'),
        id: 'reset',
        showAsAction: 'never'
      },
      {
        title: t('history'),
        id: 'history',
        showAsAction: 'never'
      },
      {
        title: t('undo'),
        id: 'undo',
        showAsAction: 'never'
      }
    ]
  };
} else if (Platform.OS === 'ios') {
  Simulator.navigatorButtons = {
    rightButtons: [
      {
        title: 'menu',
        id: 'menu'
      }
    ]
  };
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