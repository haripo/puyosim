import { connect } from 'react-redux';
import { finishDroppingAnimations, vanishPuyos, } from '../../shared/actions/actions';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import ShareModal from "../components/ShareModal";

const mapStateToProps = (state) => {
  return {
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),
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

