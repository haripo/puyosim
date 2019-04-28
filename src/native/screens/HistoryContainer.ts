import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  initializeSimulator,
  moveHighlightsLeft,
  moveHighlightsRight,
  moveHistory,
  putNextPair,
  redoField,
  resetField,
  restart,
  rotateHighlightsLeft,
  rotateHighlightsRight,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import {
  getGhost,
  getPendingPair,
} from '../../shared/selectors/simulatorSelectors';
import {
  getStack,
  getVanishingPuyos,
  isActive
} from '../../shared/selectors/fieldSelectors';
import History from '../components/History';
import { getLayout } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";
import { State } from "../../shared/reducers";

const mapStateToProps = (state: State) => {
  return {
    theme: getTheme(state.theme),
    layout: getLayout(state.layout),

    stack: getStack(state.simulator),
    ghosts: getGhost(state.simulator),
    current: state.simulator.queue[0],
    droppingPuyos: state.simulator.droppingPuyos,
    vanishingPuyos: getVanishingPuyos(state.simulator),
    isActive: isActive(state.simulator),
    puyoSkin: state.config.puyoSkin,
    pendingPair: getPendingPair(state.simulator),

    history: state.simulator.history,
    historyIndex: state.simulator.historyIndex,
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
)(History);
