import { connect } from 'react-redux';
import NextWindow from '../components/NextWindow';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    next: simulator.getIn(['queue', 1]),
    doubleNext: simulator.getIn(['queue', 2])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(NextWindow));
