// import Immutable from "immutable";
import { handleActions } from "redux-actions";

export const actions = {
  SET_ACCOUNT: "SET_ACCOUNT"
};

const store = {
  account: {}
};

const reducers = {
  [actions.SET_ACCOUNT]: (state, { payload }) => {
    state.account = payload;
    return { ...state };
  }
};

export default handleActions(reducers, store);
