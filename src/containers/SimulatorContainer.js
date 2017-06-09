import { connect } from 'react-redux';
import {
  doChainDroppingPhase,
  doChainVanishingPhase,
  finishDroppingAnimations,
  finishVanishingAnimations,
  hideHighlights,
  moveHighlightsLeft,
  moveHighlightsRight,
  putNextPair,
  resetField,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight,
  showHighlights,
  undoField
} from '../actions/actions';
import Simulator from '../components/Simulator';
import { getGhost, getPendingPair, isActive } from '../reducers/simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    stack: simulator.get('stack'),
    current: simulator.getIn(['queue', 0]),
    ghosts: getGhost(simulator),
    pendingPair: getPendingPair(simulator),
    droppingPuyos: simulator.get('droppingPuyos'),
    vanishingPuyos: simulator.get('vanishingPuyos'),
    isActive: isActive(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwiping: (position, rotation) => {
      dispatch(showHighlights(position, rotation));
    },
    onSwipeEnd: (position, rotation) => {
      dispatch(hideHighlights());
      dispatch(putNextPair(position, rotation));
      dispatch(doChainVanishingPhase());
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
      dispatch(doChainVanishingPhase());
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations());
      dispatch(doChainVanishingPhase());
    },
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations());
      dispatch(doChainDroppingPhase());
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
