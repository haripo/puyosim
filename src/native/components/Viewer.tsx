import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import { contentsMargin } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import ViewerControls from "../../shared/components/ViewerControls";
import SlimHistoryTree from "../../shared/components/HistoryTree/SlimHistoryTree";
import { HistoryRecord } from "../../shared/models/history";
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
  leftyMode: string,
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
        style={ { marginRight: 10 } }
        onPress={ () => navigation.replace('simulator', { fromViewer: true }) }
      >
        <Text style={ { color: 'white' } }>OPEN SIMULATOR</Text>
      </TouchableOpacity>
    ) : null
  });

  render() {
    return (
      <LayoutBaseContainer>
        <View
          style={ styles.container }>
          <View style={ {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            flexDirection: (this.props.leftyMode === 'on' ? 'row-reverse' : 'row')
          } }>
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
            </View>
            <View style={ styles.side }>
              <NextWindowContainer/>
              <SlimHistoryTree
                style={ { marginTop: contentsMargin } }
                history={ this.props.history }
                currentIndex={ this.props.historyIndex }
                onNodePressed={ this.props.onHistoryNodePressed }
              />
              <View style={ {
                height: 300 / 4,
              } }>
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
    backgroundColor: '#F5F5F5',
    paddingRight: contentsMargin,
    paddingBottom: contentsMargin
  },
  handlingPuyos: {
    marginTop: 3,
    marginLeft: 3,
  },
  side: {
    flex: 1,
    marginTop: contentsMargin,
    marginLeft: contentsMargin,
  },
  sideHead: {
    flex: 1
  },
  field: {
    marginTop: contentsMargin,
    marginLeft: contentsMargin
  }
});
