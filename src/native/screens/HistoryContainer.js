import { connect } from 'react-redux';
import { initializeSimulator, redoField, undoField, } from '../../shared/actions/actions';
import History from '../components/History';
import { getGhost, getPendingPair, getStack, isActive } from '../../shared/selectors/simulatorSelectors';
import toJS from '../../shared/utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.get('simulator');

  return {
    stack: getStack(simulator),
    current: simulator.getIn(['queue', 0]),
    ghosts: getGhost(simulator),
    pendingPair: getPendingPair(simulator),
    isActive: isActive(state),
    history: simulator.get('history'),
    puyoSkin: state.getIn(['config', 'puyoSkin'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSimulatorLaunched: () => {
      dispatch(initializeSimulator());
    },
    onPrevPressed: () => {
      dispatch(undoField());
    },
    onNextPressed: () => {
      dispatch(redoField());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(History));
