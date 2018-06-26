import { connect } from 'react-redux';
import { finishDroppingAnimations, vanishPuyos } from '../actions/actions';
import DroppingPuyos from '../components/DroppingPuyos';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  return {
    droppings: state.simulator.droppingPuyos,
    puyoSkin: state.config.puyoSkin
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
)(toJS(DroppingPuyos));
