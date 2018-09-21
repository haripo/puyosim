import { connect } from 'react-redux';
import ShareOption from "../components/ShareOption";
import { getShareURL, getStack } from "../../shared/selectors/simulatorSelectors";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    shareURL: getShareURL(state.simulator)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onSetComplexHistorySelected: () => {
    //   dispatch(debugSetHistory('complex'));
    // }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareOption);
