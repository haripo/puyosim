import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  moveHistory,
  reconstructHistory,
  redoField,
  runChainAnimation,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import {
  canRedo,
  canUndo,
  getGhost,
  getHistoryTreeLayout,
  getPendingPair
} from '../../shared/selectors/simulatorSelectors';
import { getStack, getVanishingPuyos, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import Viewer from '../../web/components/Viewer';

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    droppings: state.simulator.droppingPuyos,
    vanishings: getVanishingPuyos(state.simulator),

    score: state.simulator.score,
    chainScore: state.simulator.chainScore,
    chain: state.simulator.chain,

    puyoSkin: state.config.puyoSkin,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),

    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),

    history: state.simulator.history,
    historyIndex: state.simulator.historyIndex,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    isActive: isActive(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUndoSelected: () => {
      dispatch(undoField());
      dispatch(runChainAnimation('simulator'));
    },
    onRedoSelected: () => {
      dispatch(redoField());
      dispatch(runChainAnimation('simulator'));
    },
    onHistoryNodePressed: (index: number) => {
      dispatch(moveHistory(index));
      dispatch(runChainAnimation('simulator'));
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);
