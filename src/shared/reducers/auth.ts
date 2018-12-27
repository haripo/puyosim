import { REQUEST_LOGIN_SUCCEED } from '../actions/actions';
import { RNFirebase } from "react-native-firebase";

export type AuthState = {
  uid: string | null
}

export const initialState = {
  uid: null
};

function requestLoginSucceed(state: AuthState, { user }): AuthState {
  state.uid = user.uid;
  return state;
}

export const reducer = (state, action): AuthState => {
  switch (action.type) {
    case REQUEST_LOGIN_SUCCEED:
      return requestLoginSucceed(state, action);
    default:
      return state;
  }
};
