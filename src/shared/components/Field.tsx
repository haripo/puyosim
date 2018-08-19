import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import DroppingPuyosContainer from '../containers/DroppingPuyosContainer';
import VanishingPuyosContainer from '../containers/VanishingPuyosContainer';
import { contentsPadding, fieldCols } from '../utils/constants';
import GhostPuyo from './GhostPuyo';
import Puyo from './Puyo';
import { Layout } from '../selectors/layoutSelectors';
import { PendingPairPuyo, PuyoForRendering, StackForRendering } from "../selectors/simulatorSelectors";
import { Theme } from "../selectors/themeSelectors";

export interface Props {
  layout: Layout,
  theme: Theme,
  puyoSkin: string,
  isActive: boolean,
  stack: StackForRendering,
  ghosts: PendingPairPuyo[],
  style: any
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

  renderStack() {
    const { stack, isActive } = this.props;
    return [
      isActive ? this.renderGhostPuyos() : null,
      this.renderPuyos(stack)
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
    const { layout, theme, style } = this.props;
    const styles = createStyles(layout, theme);

    return (
      <View style={ [style, styles.field] } >
        { this.renderStack() }
        { this.renderCross(styles.cross) }
        <DroppingPuyosContainer />
        <VanishingPuyosContainer />
        <View style={ styles.topShadow } />
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