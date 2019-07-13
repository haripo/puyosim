import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  moveHighlightsLeft,
  moveHighlightsRight,
  moveHistory,
  putNextPair,
  reconstructHistory,
  redoField,
  resetField,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight, runChainAnimation,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import Simulator from '../components/Simulator';
import {
  canRedo,
  canUndo,
  getGhost,
  getHistoryTreeLayout,
  getPendingPair,
} from '../../shared/selectors/simulatorSelectors';
import { getStack, getVanishingPuyos, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import { State } from "../../shared/reducers";

const mapStateToProps = (state: State) => {
  return {
    stack: getStack(state.simulator),
    history: state.simulator.history,
    historyIndex: state.simulator.historyIndex,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    droppings: state.simulator.droppingPuyos,
    vanishings: getVanishingPuyos(state.simulator),
    isActive: isActive(state.simulator),
    puyoSkin: state.config.puyoSkin,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),
    score: state.simulator.score,
    chainScore: state.simulator.chainScore,
    chain: state.simulator.chain,

    match: {},
    location: {},
    mode: undefined
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
      dispatch(putNextPair());
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
    onResetSelected: () => {
      dispatch(resetField());
    },
    onRestartSelected: () => {
      dispatch(restart());
    },
    onShareSelected: () => {

    },
    onHistoryNodePressed: (index: number) => {
      dispatch(moveHistory(index));
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
