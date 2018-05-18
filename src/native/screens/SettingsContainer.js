import { connect } from 'react-redux';
import { saveConfig } from '../../shared/actions/actions';
import SettingsPage from '../components/SettingsPage';
import toJS from '../../shared/utils/toJS';
import { configItems } from '../../shared/models/Config';

const mapStateToProps = (state) => {
  return {
    config: state.get('config'),
    configItems: configItems
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
