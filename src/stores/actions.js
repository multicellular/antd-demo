import { createAction } from "redux-actions";

import { actions as common } from "./reducers/common";
import { actions as account } from "./reducers/account";
import { BaseApi } from "@apis";

// common reducers
export const setUserInfo = createAction(common.SET_USER_INFO);
export const setTokens = createAction(common.SET_TOKENS);
export const getUserInfo = createAction(common.SET_USER_INFO, () =>
  BaseApi.getMe()
);
export const getTickers = createAction(common.SET_TICKERS, () =>
  BaseApi.getTickers()
);

export const setTickers = createAction(common.SET_TICKERS);

export const getQuotes = createAction(common.SET_QUOTES, params =>
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

//account reducers
export const setAccount = createAction(account.SET_ACCOUNT);

export { common, account, createAction };
