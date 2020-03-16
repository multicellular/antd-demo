import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import _isEmpty from "lodash/isEmpty";

import Routes from "@configs/router.config";
import { BaseApi } from "@apis";
import Header from "@views/base/Header";
import Footer from "@views/base/Footer";
import "./App.less";

// import HookProvider from "@stores/HookProvider";
import globalActions, { GlobalContext } from "@stores/hookActions";

const App = () => {
  const [{ tokens, userInfo }, dispatch] = useContext(GlobalContext);

  if (tokens.token && _isEmpty(userInfo)) {
    // 路由进 / 后判断下是否需要获取用户信息
    BaseApi.getMe().then(res => {
      dispatch({ type: globalActions.SET_USER, payload: res });
    });
  }

  // useEffect(() => {
  //   if (tokens.token && _isEmpty(userInfo)) {
  //     // 路由进 / 后判断下是否需要获取用户信息
  //     BaseApi.getMe().then(res => {
  //       dispatch({ type: globalActions.SET_USER, payload: res });
  //     });
  //   }
  // });

  return (
    <div className="App">
      {/* <HookProvider> */}
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
      {/* </HookProvider> */}
    </div>
  );
};

export default App;
