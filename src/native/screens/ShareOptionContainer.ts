import { connect } from 'react-redux';
import ShareOption from "../components/ShareOption";
import { getGhost, getPendingPair, getShareURL, getStack } from "../../shared/selectors/simulatorSelectors";
import { getLayout, getLayoutForCapturingField, Layout } from "../../shared/selectors/layoutSelectors";
import { getTheme, Theme } from "../../shared/selectors/themeSelectors";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    ghosts: getGhost(state.simulator),

    shareURL: getShareURL(state.simulator),

    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    layoutForCapturingField: getLayoutForCapturingField(),
    theme: getTheme(state.theme)
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
