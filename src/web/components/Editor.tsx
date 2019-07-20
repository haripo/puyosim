import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { PendingPair, StackForRendering } from '../../types';
import { DroppingPlan, VanishingPlan } from '../../shared/models/chainPlanner';
import { Layout } from '../../shared/selectors/layoutSelectors';
import { Theme } from '../../shared/selectors/themeSelectors';
import { contentsMargin, contentsPadding } from '../../shared/utils/constants';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import ChainResult from '../../shared/components/ChainResult';
import EditorControls from '../../shared/components/EditorControls';
import { RouteComponentProps } from 'react-router';

export type Props = RouteComponentProps<{}> & {
  stack: StackForRendering,
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

  currentItem: number,

  onEditorMounted: () => void,
  onEditorUnMounted: () => void,
  onUndoSelected: () => void,
  onResetSelected: () => void,
  onFieldTouched: (row: number, col: number) => void,
  onEditItemSelected: (item: number) => void,
  onPlaySelected: () => void,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void,
}

type State = {}

export default class Editor extends Component<Props, State> {
  componentDidMount() {
    this.props.onEditorMounted();
  }

  componentWillUnmount() {
    this.props.onEditorUnMounted();
  }

  render() {
    return (
      <View
        style={ styles.container }>
        <View
          style={ {
            marginTop: contentsMargin,
            marginLeft: contentsMargin,
            marginBottom: contentsMargin
          } }
        >
          <HandlingPuyos
            pair={ this.props.pendingPair }
            puyoSkin={ this.props.puyoSkin }
            layout={ this.props.layout }
            style={ { marginBottom: contentsPadding } }>
          </HandlingPuyos>
          <Field
            stack={ this.props.stack }
            ghosts={ [] }
            isActive={ this.props.isActive }
            droppings={ this.props.droppings }
            vanishings={ this.props.vanishings }
            layout={ this.props.layout }
            theme={ this.props.theme }
            puyoSkin={ this.props.puyoSkin }
            onTouched={ this.props.onFieldTouched }
            onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
            onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
          />
        </View>
        <View style={ styles.side }>
          <View>
            <NextWindowContainer/>
            <ChainResult
              score={ this.props.score }
              chain={ this.props.chain }
              chainScore={ this.props.chainScore }
            />
          </View>
          <EditorControls
            layout={ this.props.layout }
            puyoSkin={ this.props.puyoSkin }
            selectedItem={ this.props.currentItem }
            onSelected={ this.props.onEditItemSelected }
            onPlaySelected={ this.props.onPlaySelected }
            onUndoSelected={ this.props.onUndoSelected }
            onResetSelected={ this.props.onResetSelected }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  side: {
    justifyContent: 'space-between',
    margin: contentsMargin,
    width: 170
  },
});
