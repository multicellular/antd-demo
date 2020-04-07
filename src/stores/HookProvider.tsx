import React, { useReducer } from "react";

import { GlobalContext, globalReducer, initState } from "./hookActions";

const HookProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(globalReducer, initState);

  const customDispatch = (dispatch: React.Dispatch<any>) => ({
    type,
    payload
  }: {
    type: string;
    payload: any;
  }) => {
    if (typeof payload === "object" && payload.then) {
      payload.then((res: any) => dispatch({ type, payload: res }));
      return payload;
    } else if (typeof payload === "function") {
      const result = payload();
      if (typeof result === "object" && result.then) {
        result.then((res: any) => dispatch({ type, payload: res }));
        return result;
      } else {
        dispatch({ type, payload: result });
        return Promise.resolve(result);
      }
    } else {
      dispatch({ type, payload });
      return Promise.resolve(payload);
    }
  };

  return (
    <GlobalContext.Provider value={[state, customDispatch(dispatch)]}>
      {children}
    </GlobalContext.Provider>
  );
};

export default HookProvider;
