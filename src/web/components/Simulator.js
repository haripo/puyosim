import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import { contentsMargin, simulatorWidth } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import HistoryTree from '../../shared/components/HistoryTree';

export default class Simulator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <View>
            <HandlingPuyos
              pair={ this.props.pendingPair }
              puyoSkin={ this.props.puyoSkin }>
            </HandlingPuyos>
            <Field
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              droppingPuyos={ this.props.droppingPuyos }
              vanishingPuyos={ this.props.vanishingPuyos }
              isActive={ this.props.isActive }
              style={ styles.field }
              puyoSkin={ this.props.puyoSkin }
              onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
              onSwiping={ this.props.onSwiping }
              onSwipeEnd={ this.props.onSwipeEnd }>
            </Field>
          </View>
          <View style={ styles.side }>
            <View style={ styles.sideHead }>
              <NextWindowContainer/>
              <ChainResultContainer/>
            </View>
            <SimulatorControls
              onUndoSelected={ this.props.onUndoSelected }
              onRotateLeftPressed={ this.props.onRotateLeftPressed }
              onRotateRightPressed={ this.props.onRotateRightPressed }
              onMoveLeftPressed={ this.props.onMoveLeftPressed }
              onMoveRightPressed={ this.props.onMoveRightPressed }
              onDropPressed={ this.props.onDropPressed }
              isActive={ this.props.isActive }
            />
          </View>
        </View>
        <View style={ styles.historyTree }>
          <HistoryTree
            history={ this.props.history }
            currentIndex={ this.props.historyIndex }
            onNodePressed={ this.props.onHistoryNodePressed }
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
  },
  contents: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    width: simulatorWidth - contentsMargin
  },
  side: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: contentsMargin,
    marginRight: contentsMargin,
    marginBottom: contentsMargin
  },
  sideHead: {
    flex: 1
  },
  historyTree: {
    flex: 1
  }
});
