import { connect } from 'react-redux';
import NextWindow from '../components/NextWindow';
import toJS from '../utils/toJS';
import { getDoubleNextHand, getNextHand } from '../selectors/simulatorSelectors';

const mapStateToProps = (state) => {
  return {
    next: getNextHand(state.simulator),
    doubleNext: getDoubleNextHand(state.simulator),
    puyoSkin: state.config.puyoSkin,
    numVisibleNext: state.config.numVisibleNext,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(NextWindow));
