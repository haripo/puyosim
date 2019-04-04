import { SNOW_SNACKBAR } from "../actions/actions";
import Snackbar from 'react-native-snackbar';

const snackbarMiddleware = store => next => action => {

  if (action.type === SNOW_SNACKBAR) {
    Snackbar.show({
      title: action.message,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  next(action);
};

export default snackbarMiddleware;