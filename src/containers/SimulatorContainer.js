import { connect } from 'react-redux';
import { putNextPair } from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    stack: simulator.get('stack'),
    next: simulator.getIn(['queue', 0]),
    doubleNext: simulator.getIn(['queue', 1])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwipeEnd: (location, direction) => {
      dispatch(putNextPair(location, direction));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
