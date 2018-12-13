import * as _ from 'lodash';
import React, { Component } from 'react';
import { ActionSheetIOS, Alert, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { parse } from 'query-string';
import { Navigation } from "react-native-navigation";
import { Layout as NavigationLayout } from "react-native-navigation/lib/dist/interfaces/Layout";
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import { contentsMargin, themeColor, themeLightColor } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';
// @ts-ignore
import t from '../../shared/utils/i18n';
import { PendingPair, PendingPairPuyo } from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import firebase from 'react-native-firebase';
import { StackForRendering } from "../../shared/models/stack";
import { Options } from "react-native-navigation/lib/dist/interfaces/Options";

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

  static options(passProps): Options {
    return {
      sideMenu: {
        right: {
          // @ts-ignore
          width: (Platform.OS === 'ios' ? 200 : undefined),
          enabled: true,
          visible: true
        }
      },
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
      case 'menu':
        Navigation.mergeOptions('sideMenu', {
          sideMenu: {
            right: {
              visible: true
            }
          }
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
