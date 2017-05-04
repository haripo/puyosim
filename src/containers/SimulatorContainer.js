
import { connect } from 'react-redux';
import { putPair } from '../actions/actions';
import Simulator from '../components/Simulator';

const mapStateToProps = (state) => {
  return {
    field: state.length
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
)(Simulator);
