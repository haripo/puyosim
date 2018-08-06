import { connect } from 'react-redux';
import {
  initializeSimulator,
  moveHighlightsLeft,
  moveHighlightsRight, openTwitterShare,
  putNextPair, redoField,
  resetField, resetLayout,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import Simulator from '../components/Simulator';
import {
  canRedo, canUndo, getGhost, getPendingPair, getStack,
  isActive
} from '../../shared/selectors/simulatorSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    current: state.simulator.queue[0],
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    isActive: isActive(state),
    puyoSkin: state.config.puyoSkin,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    layout: getLayout(state.layout)
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
    onShareSelected: () => {
      dispatch(openTwitterShare());
    },
    onLayout: layout => {
      dispatch(resetLayout(layout));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
