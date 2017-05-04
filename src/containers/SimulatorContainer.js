
import { connect } from 'react-redux';
import { putPair } from '../actions/actions';
import Simulator from '../components/Simulator';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  return {
    stack: state.get('stack')
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    put: (pair) => {
      dispatch(putPair(pair));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(Simulator));
