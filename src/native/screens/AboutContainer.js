import { connect } from 'react-redux';
import AboutContent from '../components/AboutContents';
import toJS from '../../shared/utils/toJS';
import { debugSetPattern } from '../../shared/actions/actions';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetKennySelected: () => {
      dispatch(debugSetPattern('kenny'));
    },
    onSetSnakeSelected: () => {
      dispatch(debugSetPattern('snake'));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(AboutContent));
