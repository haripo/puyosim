import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations, loadConfig,
  moveHighlightsLeft,
  moveHighlightsRight,
  putNextPair,
  reconstructHistory,
  redoField,
  rotateHighlightsLeft,
  rotateHighlightsRight, runChainAnimation,
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

    score: state.simulator.score,
    chainScore: state.simulator.chainScore,
    chain: state.simulator.chain,

    puyoSkin: state.config.puyoSkin as string,
    leftyMode: state.config.leftyMode,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),

    isReady: state.simulator.isReady,
    isActive: isActive(state.simulator),
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onScreenAppeared: () => {
      // editor から戻ってきたタイミングで浮いたぷよを落とす
      dispatch(runChainAnimation('simulator'));
    },
    onMounted: () => {
      dispatch(loadConfig());
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
      dispatch(runChainAnimation('simulator'));
    },
    onUndoSelected: () => {
      dispatch(undoField());
      dispatch(runChainAnimation('simulator'));
    },
    onRedoSelected: () => {
      dispatch(redoField());
      dispatch(runChainAnimation('simulator'));
    },
    onReconstructHistoryRequested: (history: string, queue: string, index: number) => {
      dispatch(reconstructHistory(history, queue, index));
      dispatch(runChainAnimation('simulator'));
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
