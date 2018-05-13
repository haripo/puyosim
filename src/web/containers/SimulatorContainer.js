import { connect } from 'react-redux';
import {
  initializeSimulator,
  moveHighlightsLeft,
  moveHighlightsRight,
  moveHistory,
  putNextPair,
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
  getGhost, getHistoryTreeLayout, getPendingPair, getStack,
  isActive
} from '../../shared/selectors/simulatorSelectors';
import toJS from '../../shared/utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.get('simulator');

  return {
    stack: getStack(simulator),
    history: simulator.get('history'),
    historyIndex: simulator.get('historyIndex'),
    historyTreeLayout: getHistoryTreeLayout(simulator),
    ghosts: getGhost(simulator),
    pendingPair: getPendingPair(simulator),
    isActive: isActive(state),
    puyoSkin: state.getIn(['config', 'puyoSkin']),
    canUndo: canUndo(simulator),
    canRedo: canRedo(simulator)
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
)(toJS(Simulator));
