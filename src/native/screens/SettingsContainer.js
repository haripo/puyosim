import { connect } from 'react-redux';
import {
  saveConfig
} from '../../shared/actions/actions';
import SettingsPage from '../components/SettingsPage';
import toJS from '../../shared/utils/toJS';

const mapStateToProps = (state) => {
  return {
    config: state.get('config')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChanged: (key, value) => {
      dispatch(saveConfig(key, value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(SettingsPage));
