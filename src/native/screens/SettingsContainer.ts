import { connect } from 'react-redux';
import { saveConfig } from '../../shared/actions/actions';
import SettingsPage from '../components/SettingsPage';
import { configItems } from '../../shared/models/config';

const mapStateToProps = (state) => {
  return {
    config: state.config,
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
)(SettingsPage);
