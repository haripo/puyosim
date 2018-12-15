import { connect } from 'react-redux';
import { openTwitterShare, resetField, restart } from '../../shared/actions/actions';
import { getTheme } from "../../shared/selectors/themeSelectors";
import RightDrawer from "../components/RightDrawer";

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state.theme),
    score: state.simulator.score,
    chain: state.simulator.chain,
    chainScore: state.simulator.chainScore,
    numSplit: state.simulator.numSplit,
    numHands: state.simulator.numHands
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetSelected: () => {
      dispatch(resetField());
    },
    onRestartSelected: () => {
      dispatch(restart());
    },
    onShareSelected: () => {
      dispatch(openTwitterShare());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightDrawer);
