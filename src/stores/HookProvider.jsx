import React, { useReducer } from "react";

import { GlobalContext, globalReducer, initState } from "./hookActions";

const HookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initState);

  const customDispatch = dispatch => ({ type, payload }) => {
    if (typeof payload === "object" && payload.then) {
      payload.then(res => dispatch({ type, payload: res }));
      return payload;
    } else if (typeof payload === "function") {
      const result = payload();
      if (typeof result === "object" && result.then) {
        result.then(res => dispatch({ type, payload: res }));
        return result;
      } else {
        dispatch({ type, payload: result });
        return new Promise.resolve(result);
      }
    } else {
      dispatch({ type, payload });
      return new Promise.resolve(payload);
    }
  };

  return (
    <GlobalContext.Provider value={[state, customDispatch(dispatch)]}>
      {children}
    </GlobalContext.Provider>
  );
};

export default HookProvider;
