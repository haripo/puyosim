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

const mapStateToProps = (state) => {
  const simulator = state.get('simulator');

  return {
    current: simulator.getIn(['queue', 0]),
    history: simulator.get('history'),
    historyIndex: simulator.get('historyIndex'),
    puyoSkin: state.getIn(['config', 'puyoSkin'])
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
