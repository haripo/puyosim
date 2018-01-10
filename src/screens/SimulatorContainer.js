import { connect } from 'react-redux';
import {
  initializeSimulator,
  hideHighlights,
  moveHighlightsLeft,
  moveHighlightsRight,
  putNextPair,
  resetField,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight,
  showHighlights,
  undoField,
  vanishPuyos
} from '../actions/actions';
import Simulator from '../components/Simulator';
import { getGhost, getPendingPair, getStack, isActive } from '../selectors/simulatorSelectors';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.get('simulator');
  return {
    stack: getStack(simulator),
    current: simulator.getIn(['queue', 0]),
    ghosts: getGhost(simulator),
    pendingPair: getPendingPair(simulator),
    isActive: isActive(state),
    moves: simulator.get('moves')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSimulatorLaunched: () => {
      dispatch(initializeSimulator());
    },
    onSwiping: (position, rotation) => {
      dispatch(showHighlights(position, rotation));
    },
    onSwipeEnd: (position, rotation) => {
      dispatch(hideHighlights());
      dispatch(putNextPair(position, rotation));
      dispatch(vanishPuyos());
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
