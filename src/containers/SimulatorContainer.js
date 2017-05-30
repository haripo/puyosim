import { connect } from 'react-redux';
import {
  doChainDroppingPhase,
  doChainVanishingPhase,
  finishDroppingAnimations,
  finishVanishingAnimations,
  hideHighlights,
  putNextPair,
  showHighlights,
  undoField,
  resetField,
  restart
} from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';
import { isActive } from '../reducers/simulator';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    stack: simulator.get('stack'),
    next: simulator.getIn(['queue', 0]),
    doubleNext: simulator.getIn(['queue', 1]),
    score: simulator.get('score'),
    highlights: simulator.get('highlights'),
    ghosts: simulator.get('ghosts'),
    droppingPuyos: simulator.get('droppingPuyos'),
    vanishingPuyos: simulator.get('vanishingPuyos'),
    isActive: isActive(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwiping: (position, direction) => {
      dispatch(showHighlights(position, direction));
    },
    onSwipeEnd: (position, direction) => {
      dispatch(hideHighlights());
      dispatch(putNextPair(position, direction));
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
      dispatch(undoField())
    },
    onResetSelected: () => {
      dispatch(resetField())
    },
    onRestartSelected: () => {
      dispatch(restart())
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
