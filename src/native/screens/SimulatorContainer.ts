import { connect } from 'react-redux';
import {
  moveHighlightsLeft,
  moveHighlightsRight,
  openTwitterShare,
  putNextPair,
  redoField,
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
  getPendingPair,
  getStack,
  isActive
} from '../../shared/selectors/simulatorSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    isActive: isActive(state),
    puyoSkin: state.config.puyoSkin as string,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
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
      dispatch(vanishPuyos());
    },
    onUndoSelected: () => {
      dispatch(undoField());
      dispatch(vanishPuyos());
    },
    onRedoSelected: () => {
      dispatch(redoField());
      dispatch(vanishPuyos());
    },
    onResetSelected: () => {
      dispatch(resetField());
    },
    onRestartSelected: () => {
      dispatch(restart());
    },
    onShareSelected: () => {
      dispatch(openTwitterShare());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Simulator);
