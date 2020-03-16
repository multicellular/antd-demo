import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers";

import ReduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(ReduxPromise))
);

export default store;
