import { connect } from 'react-redux';
import {
  initializeSimulator,
  moveHighlightsLeft,
  moveHighlightsRight,
  moveHistory,
  putNextPair, redoField,
  resetField,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight,
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
  getStack,
  isActive
} from '../../shared/selectors/simulatorSelectors';

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    history: state.simulator.history,
    historyIndex: state.simulator.historyIndex,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    isActive: isActive(state),
    puyoSkin: state.config.puyoSkin,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSimulatorLaunched: () => {
      dispatch(initializeSimulator());
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
      dispatch(putNextPair());
      dispatch(vanishPuyos());
    },
    onUndoSelected: () => {
      dispatch(undoField());
    },
    onRedoSelected: () => {
      dispatch(redoField());
    },
    onResetSelected: () => {
      dispatch(resetField());
    },
    onRestartSelected: () => {
      dispatch(restart());
    },
    onHistoryNodePressed: (index) => {
      dispatch(moveHistory(index));
      dispatch(vanishPuyos());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
