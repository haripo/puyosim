import { connect } from 'react-redux';
import { putNextPair } from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  return {
    stack: state.get('stack')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSwipeEnd: (location, direction) => {
      dispatch(putNextPair(location, direction))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
