import { connect } from 'react-redux';
import { archiveCurrentField, refreshPlayId, resetField, restart } from '../../shared/actions/actions';
import { getTheme } from "../../shared/selectors/themeSelectors";
import RightDrawer from "../components/RightDrawer";
import { Navigation } from "react-native-navigation";

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state.theme),
    score: state.simulator.score,
    chain: state.simulator.chain,
    chainScore: state.simulator.chainScore,
    numSplit: state.simulator.numSplit,
    numHands: state.simulator.numHands,
    isSaved: state.simulator.isSaved
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
    onOverwriteArchiveSelected: () => {
      dispatch(archiveCurrentField());
    },
    onSaveCopySelected: () => {
      dispatch(refreshPlayId());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightDrawer);
