import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  moveHighlightsLeft,
  moveHighlightsRight,
  putNextPair,
  reconstructHistory,
  redoField,
  rotateHighlightsLeft,
  rotateHighlightsRight,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import Simulator from '../components/Simulator';
import { canRedo, canUndo, getGhost, getPendingPair, } from '../../shared/selectors/simulatorSelectors';
import { getStack, getVanishingPuyos, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import { State } from "../../shared/reducers";

const mapStateToProps = (state: State) => {
  return {
    stack: getStack(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    droppings: state.simulator.droppingPuyos,
    vanishings: getVanishingPuyos(state.simulator),
    isActive: isActive(state.simulator),
    puyoSkin: state.config.puyoSkin as string,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onScreenAppeared: () => {
      // editor から戻ってきたタイミングで浮いたぷよを落とす
      dispatch(applyGravity('simulator'));
    },
    onRotateRightPressed: () => {
      dispatch(rotateHighlightsRight());
    },
    onRotateLeftPressed: () => {
      dispatch(rotateHighlightsLeft());
    },
    onMoveRightPressed: () => {
      dispatch(moveHighlightsRight());
    },
    onMoveLeftPressed: () => {
      dispatch(moveHighlightsLeft());
    },
    onDropPressed: () => {
      dispatch(putNextPair('simulator'));
      dispatch(vanishPuyos('simulator'));
    },
    onUndoSelected: () => {
      dispatch(undoField());
      dispatch(vanishPuyos('simulator'));
      dispatch(applyGravity('simulator'));
    },
    onRedoSelected: () => {
      dispatch(redoField());
      dispatch(vanishPuyos('simulator'));
      dispatch(applyGravity('simulator'));
    },
    onReconstructHistoryRequested: (history: string, queue: string, index: number) => {
      dispatch(reconstructHistory(history, queue, index))
    },
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations('simulator'));
      dispatch(applyGravity('simulator'));
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations('simulator'));
      dispatch(vanishPuyos('simulator'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
