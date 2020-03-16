import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
// import { isLogin } from "./common";

import Home from "@views/home/Index"; // 首页
import Exchange from "@views/exchange/Index"; // 币币交易
// import User, { UserInfo, UserAssets } from "@pages/user"; // 首页
import Login from "@views/account/Login"; // 登录相关
import NotFound from "@views/base/NotFound";

// const PrivateRoute = ({
//     children,
//     ...rest
// }) => {
//     return (<Route {...rest} render={() => children} />);
// }

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/home" />
    <Route exact path="/home" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/exchange" component={Exchange} />
    {/* <Route exact path="/forgot" component={Forgot} />
    <Route exact path="/register" component={Register} /> */}
    {/* <Route path="/user" component={User} onEnter={isLogin}>
                <Redirect exact from='/user' to='/user/info' />
                <Route exact path="/user/info" component={UserInfo} />
                <Route exact path="/user/info" component={UserInfo} />
            </Route> */}
    {/* <Route
      path="/user"
      onEnter={isLogin}
      render={() => (
        <User>
          <Switch>
            <Redirect exact from="/user" to="/user/info" />
            <Route exact path="/user/info" component={UserInfo} />
            <Route exact path="/user/assets" component={UserAssets} />
          </Switch>
        </User>
      )}
    ></Route> */}
    {/* <PrivateRoute path="/protected">
                <Route exact path="/nav" component={Layout.Nav} />
            </PrivateRoute> */}
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
