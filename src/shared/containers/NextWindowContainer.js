import { connect } from 'react-redux';
import NextWindow from '../components/NextWindow';
import toJS from '../utils/toJS';
import { getDoubleNextHand, getNextHand } from '../selectors/simulatorSelectors';

const mapStateToProps = (state) => {
  return {
    next: getNextHand(state.get('simulator')),
    doubleNext: getDoubleNextHand(state.get('simulator')),
    puyoSkin: state.getIn(['config', 'puyoSkin']),
    numVisibleNext: state.getIn(['config', 'numVisibleNext']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(NextWindow));
