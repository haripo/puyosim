import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import { contentsMargin } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';
import { PendingPair, PendingPairPuyo } from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import ViewerControls from "../../shared/components/ViewerControls";
import { StackForRendering } from "../../shared/models/stack";
import SlimHistoryTree from "../../shared/components/HistoryTree/SlimHistoryTree";
import { HistoryRecord } from "../../shared/models/history";

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

  isActive: boolean,
  canUndo: boolean,
  canRedo: boolean,

  history: HistoryRecord[],
  historyIndex: number,
  onHistoryNodePressed: (index: number) => void,

  onUndoSelected: () => void,
  onRedoSelected: () => void,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void
}

type State = {}

export default class Viewer extends Component<Props, State> {

  static navigationOptions = ({ navigation }) => ({
    title: 'Viewer',
    headerRight: navigation.getParam('root', false) ? (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={ () => navigation.replace('simulator', { ignoreDeepLink: true }) }
      >
        <Text style={{ color: 'white' }}>OPEN SIMULATOR</Text>
      </TouchableOpacity>
    ) : null
  });

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
              />
              {/*
                this.state.isiVisible == false のとき、
                このコンポーネントは history 画面などの screen によって隠されている。
                その場合、アニメーション完了時のコールバックが history 画面のものとあわせて
                2 回発行されてしまうため、それを防ぐ。
               */}
            </View>
            <View style={ styles.side }>
              <NextWindowContainer/>
              <SlimHistoryTree
                style={{ marginTop: contentsMargin }}
                history={ this.props.history }
                currentIndex={ this.props.historyIndex }
                onNodePressed={ this.props.onHistoryNodePressed }
              />
              <ViewerControls
                onUndoSelected={ this.props.onUndoSelected }
                onRedoSelected={ this.props.onRedoSelected }
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
