import { connect } from 'react-redux';
import { finishDroppingAnimations, vanishPuyos, } from '../../shared/actions/actions';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import ShareModal from "../components/ShareModal";
import { getCurrentPathShareUrl, getWholePathShareUrl } from "../../shared/selectors/shareOptionSelectors";

const mapStateToProps = (state) => {
  return {
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),
    wholePathShareUrl: getWholePathShareUrl(state),
    currentPathShareUrl: getCurrentPathShareUrl(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations());
      dispatch(vanishPuyos());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareModal);

