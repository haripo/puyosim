import { connect } from 'react-redux';
import {
  moveHistory,
  openTwitterShare,
  resetField,
  restart,
  undoField,
  vanishPuyos,
} from '../../shared/actions/actions';
import History from '../components/History';
import toJS from '../../shared/utils/toJS';
import { getHistoryTreeLayout } from '../../shared/selectors/simulatorSelectors';

const mapStateToProps = (state) => {
  return {
    current: state.simulator.queue[0],
    history: state.simulator.history,
    historyTreeLayout: getHistoryTreeLayout(state.simulator),
    historyIndex: state.simulator.historyIndex,
    puyoSkin: state.config.puyoSkin
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(History));
