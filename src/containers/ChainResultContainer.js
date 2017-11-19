import { connect } from 'react-redux';
import ChainResult from '../components/ChainResult';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.get('simulator');
  return {
    score: simulator.get('score'),
    chain: simulator.get('chain'),
    chainScore: simulator.get('chainScore')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ChainResult));
