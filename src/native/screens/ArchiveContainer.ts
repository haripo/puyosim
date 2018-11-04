import { connect } from 'react-redux';
import Archive from '../components/Archive';
import {
  canRedo,
  canUndo,
  getGhost,
  getHistoryTreeLayout,
  getPendingPair,
  getStack,
  getVanishingPuyos,
  isActive
} from "../../shared/selectors/simulatorSelectors";
import { getLayoutForArchivedListField } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    current: state.simulator.queue[0],
    ghosts: getGhost(state.simulator),
    pendingPair: getPendingPair(state.simulator),
    droppingPuyos: state.simulator.droppingPuyos,
    vanishingPuyos: getVanishingPuyos(state.simulator),
    isActive: isActive(state),
    puyoSkin: state.config.puyoSkin,
    canUndo: canUndo(state.simulator),
    canRedo: canRedo(state.simulator),
    history: state.simulator.history,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    historyIndex: state.simulator.historyIndex,
    layout: getLayoutForArchivedListField(),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Archive);
