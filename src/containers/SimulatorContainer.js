import { connect } from 'react-redux';
import { showHighlight, hideHighlight, putNextPair } from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    stack: simulator.get('stack'),
    next: simulator.getIn(['queue', 0]),
    doubleNext: simulator.getIn(['queue', 1]),
    highlight: simulator.get('highlight')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwiping: (position, direction) => {
      dispatch(showHighlight(position, direction));
    },
    onSwipeEnd: (position, direction) => {
      dispatch(hideHighlight());
      dispatch(putNextPair(position, direction));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
