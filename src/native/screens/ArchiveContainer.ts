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
import { State } from "../../shared/reducers";
import {
  deleteArchive,
  loadArchive,
  loadArchivesListFirstPage,
  loadArchivesListNextPage
} from "../../shared/actions/actions";
import { getArchivedPlays } from "../../shared/selectors/archiveSelectors";

const mapStateToProps = (state: State) => {
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
    theme: getTheme(state.theme),

    archivedPlays: getArchivedPlays(state.archive)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onArchiveOpened() {
      dispatch(loadArchivesListFirstPage());
    },
    onItemPressed(id: string) {
      dispatch(loadArchive(id));
    },
    onEndReached() {
      dispatch(loadArchivesListNextPage());
    },
    onDeleteSelected(id: string) {
      dispatch(deleteArchive(id))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Archive);
