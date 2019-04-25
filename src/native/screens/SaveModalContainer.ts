import { connect } from 'react-redux';
import { archiveCurrentField, editArchive } from '../../shared/actions/actions';
import SaveModal from "../components/SaveModal";
import { getStack } from "../../shared/selectors/simulatorSelectors";
import { getLayout } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";
// @ts-ignore
import { ArchiveRequestPayload } from "../../shared/utils/OnlineStorageService";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),
    isSaved: state.simulator.isSaved,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSavePressed: (edited: ArchiveRequestPayload, isSaved: boolean) => {
      if (isSaved) {
        dispatch(editArchive(edited));
      } else {
        dispatch(archiveCurrentField(edited));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveModal);
