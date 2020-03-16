import React, { createContext, useReducer } from "react";

const Context = createContext();
export default Context;

export const actions = {
  SET_USER: "SET_USER"
};

const initState = {
  userInfo: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      state.userInfo = action.payload;
      return state;
    default:
      return state;
  }
};

export const HookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};
