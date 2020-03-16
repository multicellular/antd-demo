// import Immutable from "immutable";
import { handleActions } from "redux-actions";
import cookies from "browser-cookies";

export const actions = {
  SET_USER_INFO: "SET_USER_INFO",
  SET_TOKENS: "SET_TOKENS",
  SET_TICKERS: "SET_TICKERS",
  SET_QUOTES: "SET_QUOTES"
};

const store = {
  userInfo: {},
  tokens: {},
  quotes: {},
  language: "zh-CN",
  tickers: []
};

const reducers = {
  [actions.SET_USER_INFO]: (state, { payload }) => {
    state.tokens = payload.tokens;
    if (payload.tokens) {
      cookies.set("r-tokens", JSON.stringify(payload.tokens[0]));
    }
    delete payload.tokens;
    state.userInfo = payload;
    return { ...state };
  },
  [actions.SET_TOKENS]: (state, { payload }) => {
    state.tokens = payload;
    return { ...state };
  },
  [actions.SET_TICKERS]: (state, { payload }) => {
    state.tickers = payload || [];
    return { ...state };
  },
  [actions.SET_QUOTES]: (state, { payload }) => {
    state.quotes = payload || {};
    return { ...state };
  }
};

export default handleActions(reducers, store);
