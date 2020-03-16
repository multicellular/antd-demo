import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import _isEmpty from "lodash/isEmpty";
import cookies from "browser-cookies";

import Routes from "@configs/router.config";
import store from "@stores/store";
import * as api from "@apis";

import Header from "@views/base/Header";
import Footer from "@views/base/Footer";
import "./App.less";
import { setTokens, getUserInfo } from "@stores/actions";

import { HookProvider } from "@stores/hookReducers";

let tokens = cookies.get("r-tokens");
try {
  tokens = JSON.parse(tokens) || {};
  store.dispatch(setTokens(tokens));
} catch (error) {
  tokens = {};
}

class App extends React.Component {
  componentDidMount() {
    const state = store.getState();
    // let tokenObj = state.global.tokens;
    if (tokens.token && _isEmpty(state.account.info)) {
      // 路由进 / 后判断下是否需要获取用户信息
      store.dispatch(getUserInfo());
    }
  }

  render() {
    return (
      <div className="App">
        <HookProvider>
          <Provider store={store} api={api}>
            <BrowserRouter>
              <header id="header">
                <Header />
              </header>
              <main id="main">
                <Routes />
                <footer id="footer">
                  <Footer />
                </footer>
              </main>
            </BrowserRouter>
          </Provider>
        </HookProvider>
      </div>
    );
  }
}

export default App;
