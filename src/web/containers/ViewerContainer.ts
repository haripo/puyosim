import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  moveHistory,
  reconstructHistory,
  redoField,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import Simulator from '../components/Simulator';
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

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    history: state.simulator.history,
    historyIndex: state.simulator.historyIndex,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    droppings: state.simulator.droppingPuyos,
    vanishings: getVanishingPuyos(state.simulator),
    isActive: isActive(state),
    puyoSkin: state.config.puyoSkin,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),
    mode: 'view'
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUndoSelected: () => {
      dispatch(undoField());
      dispatch(vanishPuyos());
    },
    onRedoSelected: () => {
      dispatch(redoField());
      dispatch(vanishPuyos());
    },
    onHistoryNodePressed: (index: number) => {
      dispatch(moveHistory(index));
      dispatch(vanishPuyos());
    },
    onReconstructHistoryRequested: (history: string, queue: string, index: number) => {
      dispatch(reconstructHistory(history, queue, index))
    },
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations());
      dispatch(applyGravity());
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations());
      dispatch(vanishPuyos());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
