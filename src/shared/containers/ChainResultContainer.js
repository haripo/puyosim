import { connect } from 'react-redux';
import ChainResult from '../components/ChainResult';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  return {
    score: state.simulator.score,
    chain: state.simulator.chain,
    chainScore: state.simulator.chainScore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ChainResult));
