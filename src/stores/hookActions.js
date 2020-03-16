import { createContext } from "react";
import cookies from "browser-cookies";
import { BaseApi } from "@apis";

export const GlobalContext = createContext();

let initState = {
  userInfo: {},
  tokens: {},
  tickers: [],
  quotes: {}
};

let tokens = cookies.get("r-tokens");
try {
  tokens = JSON.parse(tokens) || {};
  initState.tokens = tokens;
} catch (error) {}

export { initState };

const actions = {
  SET_USER: "SET_USER",
  SET_TOKENS: "SET_TOKENS",
  SET_QUOTES: "SET_QUOTES",
  SET_TICKERS: "SET_TICKERS"
};

export const globalReducer = (state, { type, payload }) => {
  switch (type) {
    case actions.SET_USER:
      state.tokens = payload && payload.tokens ? payload.tokens[0] : {};
      delete payload.tokens;
      state.userInfo = payload || {};
      return state;
    case actions.SET_TOKENS:
      state.tokens = payload || {};
      return state;
    case actions.SET_QUOTES:
      state.quotes = payload || {};
      return state;
    case actions.SET_TICKERS:
        console.log('actions.SET_TICKERS');
      state.tickers = payload || [];
      return state;
    default:
      return state;
  }
};

const createCustomDispatch = (type, payload) => ({ type, payload });

export const getQuotes = params =>
  createCustomDispatch(
    actions.SET_QUOTES,
    BaseApi.getQuotes(params).then(({ data }) => {
      let quotes = {};
      data.forEach(quote => {
        let quoteObj = {};
        quote.quotes.forEach(item => {
          quoteObj[item.source + "_" + item.currency] = item.price;
        });
        quotes[quote.symbol.toLowerCase()] = quoteObj;
      });
      return quotes;
    })
  );

export const getTickers = () =>
  createCustomDispatch(actions.SET_TICKERS, BaseApi.getTickers());

export default actions;
