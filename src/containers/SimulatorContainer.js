import { connect } from 'react-redux';
import { showHighlights, hideHighlights, putNextPair } from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    stack: simulator.get('stack'),
    next: simulator.getIn(['queue', 0]),
    doubleNext: simulator.getIn(['queue', 1]),
    highlights: simulator.get('highlights'),
    ghosts: simulator.get('ghosts'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwiping: (position, direction) => {
      dispatch(showHighlights(position, direction));
    },
    onSwipeEnd: (position, direction) => {
      dispatch(hideHighlights());
      dispatch(putNextPair(position, direction));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
