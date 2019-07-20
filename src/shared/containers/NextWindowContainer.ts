import { connect } from 'react-redux';
import NextWindow from '../components/NextWindow';
import { getDoubleNextHand, getNextHand } from '../selectors/simulatorSelectors';
import { getTheme } from '../selectors/themeSelectors';
import { getLayout } from '../selectors/layoutSelectors';
import { State } from '../reducers';

const mapStateToProps = (state: State) => {
  return {
    next: getNextHand(state.simulator),
    doubleNext: getDoubleNextHand(state.simulator),
    puyoSkin: state.config.puyoSkin,
    numVisibleNext: state.config.numVisibleNext,
    theme: getTheme(state.theme),
    layout: getLayout(state.layout),
    leftyMode: state.config.leftyMode
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NextWindow);
