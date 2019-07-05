import React, { Component } from 'react';
import { Alert, Linking, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { parse } from 'query-string';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import { contentsMargin } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';
import { t } from '../../shared/platformServices/i18n';
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import firebase from 'react-native-firebase';
import { getMinimumSupportedAppVersion } from "../../shared/platformServices/remoteConfig";
import VersionNumber from "react-native-version-number";
import Icon from "react-native-vector-icons/MaterialIcons";
import SplashScreen from 'react-native-splash-screen'
import { NavigationScreenProps } from "react-navigation";
import ChainResult from "../../shared/components/ChainResult";
import semver from 'semver';
import { PendingPair, PendingPairPuyo, StackForRendering } from "../../types";

export type Props = {
  stack: StackForRendering,
  ghosts: PendingPairPuyo[],
  pendingPair: PendingPair,
  droppings: DroppingPlan[],
  vanishings: VanishingPlan[],

  score: number,
  chainScore: number,
  chain: number,

  puyoSkin: string,
  layout: Layout,
  theme: Theme,

  isReady: boolean,
  isActive: boolean,
  canUndo: boolean,
  canRedo: boolean,

  onMounted: () => void,
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
  onScreenAppeared: () => void,
}

type State = {
  isVisible: boolean,
}

export default class Simulator extends Component<Props & NavigationScreenProps, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'rensim',
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={ () => navigation.toggleDrawer() }
      >
        <Icon name={ 'menu' } size={ 25 } color="#FFF" />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
    };

    this.props.navigation.addListener('didFocus', () => {
      this.props.onScreenAppeared();
      this.setState({ isVisible: true });
    });

    this.props.navigation.addListener('didBlur', () => {
      // コンポーネントが非表示の時 isVisible = false とし，
      // 連鎖アニメーションのループが simulator と viewer で重複しないようにする
      this.setState({ isVisible: false });
    });
  }

  private launchViewer(url) {
    if (!url) {
      return
    }

    const query = parse(url.split('?')[1]);
    if ('q' in query && 'h' in query) {
      // TODO: type conversion
      this.props.onReconstructHistoryRequested(
        query['h'] as string,
        query['q'] as string,
        'i' in query ? parseInt(query['i'] as string) : 0,
      )
    }

    this.props.navigation.replace('viewer', { root: true });
  }

  async componentDidMount() {
    SplashScreen.hide();

    this.props.onMounted();

    // deprecated version warning
    const minimumSupportedAppVersion = await getMinimumSupportedAppVersion();
    if (semver.lt(VersionNumber.appVersion, minimumSupportedAppVersion || '0.0.1')) {
      Alert.alert(
        'App deprecated',
        t('updateRequired'),
        [
          {
            text: 'OK',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL(`itms-apps://itunes.apple.com/app/1435074935`);
              } else if (Platform.OS === 'android') {
                Linking.openURL(
                  `market://details?id=com.puyosimulator`
                );
              }
            }
          }
        ]
      );
    }

    // open URL in viewer mode
    if (!this.props.navigation.getParam('ignoreDeepLink', false)) {
      firebase.links()
        .getInitialLink()
        .then((url) => {
          this.launchViewer(url);
        });
    }

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

    // setTimeout(() => {
    //   this.launchViewer("https://puyos.im/v?q=FrGDrFxsiryjEsiiDGyxwkDkGswjqksqrqrFDEpzppGkkkGkDzFswpplqxkwqGkzEEpFiGDzrywrrsijrFxjxFsDjiyjGFljizwyjsjFzxrGjplEqxxlGizslrwpwsFk&h=msapsghoeqfbmrccdfjkuqoiceuobqbahcgdvfhprrdpaicubneotmncfmpoccigfetqbdcphoidrpahc9&i=0");
    // }, 1);
  }

  render() {
    return (
      <LayoutBaseContainer isLoading={ !this.props.isReady }>
        <View
          style={ styles.container }>
          <SafeAreaView style={ { flex: 1 } }>
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
                  onDroppingAnimationFinished={ this.state.isVisible ? this.props.onDroppingAnimationFinished : undefined }
                  onVanishingAnimationFinished={ this.state.isVisible ? this.props.onVanishingAnimationFinished : undefined }
                />
              </View>
              <View style={ styles.side }>
                <View style={ styles.sideHead }>
                  <NextWindowContainer/>
                  <ChainResult
                    score={ this.props.score }
                    chain={ this.props.chain }
                    chainScore={ this.props.chainScore }
                  />
                </View>
                <SimulatorControls
                  onUndoSelected={ this.props.onUndoSelected }
                  onRedoSelected={ this.props.onRedoSelected }
                  onRotateLeftPressed={ this.props.onRotateLeftPressed }
                  onRotateRightPressed={ this.props.onRotateRightPressed }
                  onMoveLeftPressed={ this.props.onMoveLeftPressed }
                  onMoveRightPressed={ this.props.onMoveRightPressed }
                  onDropPressed={ this.props.onDropPressed }
                  isActive={ this.props.isActive && this.state.isVisible }
                  canUndo={ this.props.canUndo }
                  canRedo={ this.props.canRedo }
                />
              </View>
            </View>
          </SafeAreaView>
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
    marginTop: contentsMargin,
    marginBottom: contentsMargin
  },
  sideHead: {
    flex: 1
  },
  field: {
    margin: contentsMargin
  }
});
