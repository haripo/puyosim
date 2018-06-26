import { connect } from 'react-redux';
import { applyGravity, finishVanishingAnimations } from '../actions/actions';
import VanishingPuyos from '../components/VanishingPuyos';
import toJS from '../utils/toJS';
import { getVanishingPuyos } from '../selectors/simulatorSelectors';

const mapStateToProps = (state) => {
  return {
    vanishings: getVanishingPuyos(state.simulator),
    puyoSkin: state.config.puyoSkin
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations());
      dispatch(applyGravity());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(VanishingPuyos));
