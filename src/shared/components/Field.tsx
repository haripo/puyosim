import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DroppingPuyos from './DroppingPuyos';
import VanishingPuyos from './VanishingPuyos';
import { contentsPadding, fieldCols, fieldRows } from '../utils/constants';
import GhostPuyo from './GhostPuyo';
import Puyo from './Puyo';
import { Layout } from '../selectors/layoutSelectors';
import { PendingPairPuyo } from "../selectors/simulatorSelectors";
import { Theme } from "../selectors/themeSelectors";
import { DroppingPlan, VanishingPlan } from "../models/chainPlanner";
import _ from 'lodash';
import { PuyoForRendering, StackForRendering } from "../models/stack";

export interface Props {
  layout: Layout,
  theme: Theme,
  puyoSkin: string,
  isActive: boolean,
  stack: StackForRendering,
  ghosts: PendingPairPuyo[],
  droppings?: DroppingPlan[],
  vanishings?: VanishingPlan[],
  style: any,

  onTouched?: (row: number, col: number) => void,

  onVanishingAnimationFinished?: () => void,
  onDroppingAnimationFinished?: () => void
}

interface State {
}

/**
 * Component for render field
 */
export default class Field extends Component<Props, State> {
  constructor(props, context) {
    super(props, context);
  }

  renderPuyos(stack: StackForRendering) {
    const {
      layout: { puyoSize },
      puyoSkin
    } = this.props;

    return stack.map((puyos, row) => {
      return puyos.map((puyo: PuyoForRendering, col) => {
        if (puyo.color === 0 || puyo.isDropping) return null;
        return (
          <Puyo
            size={ puyoSize }
            puyo={ puyo.color }
            x={ col * puyoSize + contentsPadding }
            y={ row * puyoSize + contentsPadding }
            connections={ puyo.connections }
            skin={ puyoSkin }
            key={ `puyo-${row}-${col}` }
          />
        );
      })
    });
  }

  renderGhostPuyos() {
    const {
      layout: { puyoSize },
      puyoSkin,
      ghosts
    } = this.props;

    return ghosts.map(ghost => (
      <GhostPuyo
        size={ puyoSize }
        puyo={ ghost.color }
        skin={ puyoSkin }
        key={ `puyo-${ghost.row}-${ghost.col}` }
        x={ ghost.col * puyoSize + contentsPadding }
        y={ ghost.row * puyoSize + contentsPadding }
      />
    ));
  }

  renderTouchables() {
    const { layout: { puyoSize }, onTouched } = this.props;

    if (!onTouched) return;

    let l: JSX.Element[] = [];
    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        l.push(
          <TouchableOpacity
            key={ `t-${i}-${j}` }
            onPress={ () => onTouched(i, j) }
            style={{
              position: 'absolute',
              top: i * puyoSize + contentsPadding,
              left: j * puyoSize + contentsPadding,
              width: puyoSize,
              height: puyoSize
            }}
          >
          </TouchableOpacity>
        );
      }
    }
    return l;
  }

  renderStack() {
    const { stack, isActive } = this.props;

    return [
      isActive ? this.renderGhostPuyos() : null,
      this.renderPuyos(stack),
    ];
  }

  /**
   * Renders X mark
   * @return {JSX.Element} element
   */
  renderCross(style: any): JSX.Element {
    return (
      <Image
        source={ require('../../../assets/cross.png') }
        style={ style }
      />
    )
  }

  render() {
    const { layout, theme, style, onTouched } = this.props;
    const styles = createStyles(layout, theme);

    return (
      <View style={ [style, styles.field] }>
        { this.renderStack() }
        { this.renderCross(styles.cross) }
        { this.props.droppings ? (
          <DroppingPuyos
            layout={ layout }
            puyoSkin={ this.props.puyoSkin }
            droppings={ this.props.droppings }
            onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished || _.noop }
          />
        ) : null
        }
        {
          this.props.vanishings ? (
            <VanishingPuyos
              layout={ layout }
              puyoSkin={ this.props.puyoSkin }
              vanishings={ this.props.vanishings }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished || _.noop }
            />
          ) : null
        }
        <View style={ styles.topShadow }/>
        { onTouched ? this.renderTouchables() : null }
      </View>
    );
  }
}

function createStyles(layout: Layout, theme: Theme) {
  return StyleSheet.create({
    field: {
      backgroundColor: theme.cardBackgroundColor,
      elevation: 2,
      width: layout.field.width,
      height: layout.field.height
    },
    cross: {
      position: 'absolute',
      width: layout.puyoSize,
      height: layout.puyoSize,
      top: layout.puyoSize + contentsPadding,
      left: layout.puyoSize * 2 + contentsPadding
    },
    topShadow: {
      width: layout.puyoSize * fieldCols + contentsPadding * 2,
      height: layout.puyoSize + contentsPadding,
      backgroundColor: theme.themeColor,
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      left: 0,
    }
  });
}