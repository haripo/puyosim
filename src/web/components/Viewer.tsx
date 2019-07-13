import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { parse } from 'query-string';
import { HotKeys } from 'react-hotkeys';

import { PendingPair, PendingPairPuyo, StackForRendering } from '../../types';
import { HistoryRecord } from '../../shared/models/history';
import { DroppingPlan, VanishingPlan } from '../../shared/models/chainPlanner';
import { Layout } from '../../shared/selectors/layoutSelectors';
import { Theme } from '../../shared/selectors/themeSelectors';
import { contentsMargin, contentsPadding } from '../../shared/utils/constants';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import HistoryTree from '../../shared/components/HistoryTree/HistoryTree';
import ViewerControls from '../../shared/components/ViewerControls';
import ChainResult from '../../shared/components/ChainResult';

export type Props = {
  params: any,

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

  canUndo: boolean,
  canRedo: boolean,
  isActive: boolean,

  onUndoSelected: () => void,
  onRedoSelected: () => void,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void,

  history: HistoryRecord[],
  historyIndex: number,
  historyTreeLayout: any,
  onHistoryNodePressed: (index: number) => void,
  onReconstructHistoryRequested: (history: string, queue: string, index: number) => void,
}

export default class Viewer extends Component<Props, {}> {
  componentDidMount() {
    const query = parse(this.props.params);
    if ('q' in query && 'h' in query) {
      // FIXME: type conversions
      this.props.onReconstructHistoryRequested(
        query['h'] as string,
        query['q'] as string,
        'i' in query ? parseInt(query['i'] as string) : 0,
      )
    }
  }

  render() {
    const keyMap = {
      'undo': 'a',
      'redo': 's'
    };

    const handleKey = handler => {
      return () => {
        if (this.props.isActive) {
          handler()
        }
      }
    };

    const keyHandlers = {
      'undo': handleKey(this.props.onUndoSelected),
      'redo': handleKey(this.props.onRedoSelected)
    };

    return (
      <HotKeys
        keyMap={ keyMap }
        handlers={ keyHandlers }
        style={ { display: 'flex', alignItems: 'stretch', flexGrow: 1 } }
        focused>
        { /* Focused on mounted to enable hotkeys */ }
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
            ghosts={ this.props.ghosts }
            droppings={ this.props.droppings }
            vanishings={ this.props.vanishings }
            isActive={ this.props.isActive }
            style={ {} }
            theme={ this.props.theme }
            layout={ this.props.layout }
            puyoSkin={ this.props.puyoSkin }
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
          <View style={ {
            display: 'flex',
            flexDirection: 'row'
          } }>
            <ViewerControls
              onUndoSelected={ this.props.onUndoSelected }
              onRedoSelected={ this.props.onRedoSelected }
              isActive={ this.props.isActive }
              canUndo={ this.props.canUndo }
              canRedo={ this.props.canRedo }
              shortcuts={ keyMap }
            />
          </View>
        </View>
        <View>
          <HistoryTree
            historyTreeLayout={ this.props.historyTreeLayout }
            onNodePressed={ this.props.onHistoryNodePressed }
          />
        </View>
      </HotKeys>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  side: {
    justifyContent: 'space-between',
    margin: contentsMargin,
    width: 170
  },
  hotkeyElement: {
    borderWidth: 0
  }
});
