import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { contentsMargin, themeColor, themeLightColor } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SlimHistoryTree from "../../shared/components/HistoryTree/SlimHistoryTree";
import { HistoryRecord } from "../../shared/models/history";
import { Theme } from "../../shared/selectors/themeSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";

export interface Props {
  theme: Theme,
  layout: Layout,

  stack: any,
  ghosts: any,
  droppingPuyos: any,
  vanishingPuyos: any,
  isActive: boolean,
  puyoSkin: string,
  pendingPair: any,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void,

  history: HistoryRecord[],
  historyIndex: number,
  onHistoryNodePressed: Function,
}

interface State {
}

export default class History extends Component<Props, State> {
  static options() {
    return {
      topBar: {
        title: {
          text: 'History',
        },
      },
    }
  }

  render() {
    return (
      <View style={ styles.container }>
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
              style={ styles.field }
              puyoSkin={ this.props.puyoSkin }
              theme={ this.props.theme }
              layout={ this.props.layout }
              droppings={ this.props.droppingPuyos }
              vanishings={ this.props.vanishingPuyos }
              onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }>
            </Field>
          </View>
          <View style={ styles.side }>
            <SlimHistoryTree
              history={ this.props.history }
              currentIndex={ this.props.historyIndex }
              onNodePressed={ this.props.onHistoryNodePressed }
            />
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    marginTop: contentsMargin,
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
