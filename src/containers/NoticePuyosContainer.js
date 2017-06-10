import { connect } from 'react-redux';
import NoticePuyos from '../components/NoticePuyos';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    score: simulator.get('score')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(NoticePuyos));
