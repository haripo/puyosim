import { connect } from 'react-redux';
import { archiveCurrentField, editArchive } from '../../shared/actions/actions';
import SaveModal from "../components/SaveModal";
import { getStack } from "../../shared/selectors/simulatorSelectors";
import { getLayout } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSavePressed: (id: string | null, title: string) => {
      if (id) {
        dispatch(editArchive(id, title));
      } else {
        dispatch(archiveCurrentField(title));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveModal);
