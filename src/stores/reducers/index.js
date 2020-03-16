import { combineReducers } from "redux";

import common from "./common";
import account from "./account";

const allReducers = combineReducers({
  account,
  common
});

export default allReducers;
