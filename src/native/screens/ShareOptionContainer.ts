import { connect } from 'react-redux';
import ShareOption from "../components/ShareOption";
import {
  getGhostForSnapshot,
  getShareURL,
  getStackForSnapshot,
  hasEditRecord
} from "../../shared/selectors/simulatorSelectors";
import { getLayout, getLayoutForCapturingField } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";

const mapStateToProps = (state) => {
  return {
    stack: getStackForSnapshot(state.simulator),
    ghosts: getGhostForSnapshot(state.simulator),

    shareURLs: getShareURL(state.simulator),
    hasEditRecord: hasEditRecord(state.simulator),

    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    layoutForCapturingField: getLayoutForCapturingField(),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareOption);
