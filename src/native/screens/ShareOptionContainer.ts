import { connect } from 'react-redux';
import ShareOption from "../components/ShareOption";
import {
  getGhostForSnapshot,
  getStackForSnapshot,
  hasEditRecord
} from "../../shared/selectors/simulatorSelectors";
import { getLayout, getLayoutForCapturingField } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";
import { State } from "../../shared/reducers";
import { changeShareOption, shareConfirmed } from "../../shared/actions/actions";
import { getShareUrl } from "../../shared/selectors/shareOptionSelectors";

const mapStateToProps = (state: State) => {
  return {
    shareOption: state.shareOption.shareOption,
    hasEditRecord: hasEditRecord(state.simulator),

    stack: getStackForSnapshot(state.simulator),
    ghosts: getGhostForSnapshot(state.simulator),

    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    layoutForCapturingField: getLayoutForCapturingField(),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onShareOptionChanged: (hasUrl, hasMedia) => {
      dispatch(changeShareOption({ hasUrl, hasMedia }));
    },
    onSharePressed: () => {
      dispatch(shareConfirmed());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareOption);
