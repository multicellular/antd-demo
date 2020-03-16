import React from "react";
import { Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./less/header.less";
import logoPng from "@assets/images/logo.png";

const { Item } = Menu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: ""
    };
  }
  handleClick = () => {};
  render() {
    const navs = [
      {
        to: "/",
        children: <p>首页</p>
      },
      {
        to: "/exchange",
        children: <p>币币交易</p>
      },
      {
        to: "/user/assets",
        children: <p>法币交易</p>
      },
      {
        to: "/help",
        children: <p>帮助中心</p>
      }
      // {
      //   to: "/login",
      //   children: <p>登录</p>
      // },
      // {
      //   to: "/register",
      //   children: <p>注册</p>
      // }
    ];
    const navChildren = navs.map(item => {
      return (
        <Item key={item.to} className="header3-item">
          <Link {...item} className={`header3-item-block`} />
        </Item>
      );
    });

    const userMenu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/user/info">我的账户</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/user/assets">我的资产</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" disabled>
          <Link to="/user/history">历史记录</Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="header-wrapper">
        <div className="menu-wrapper">
          <img className="r-logo" alt="Rlogo" src={logoPng} />
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            {navChildren}
          </Menu>
        </div>
        <div className="user-info">
          {this.props.userInfo && this.props.userInfo.email ? (
            <Dropdown overlay={userMenu}>
              <a href="/user/info" onClick={e => e.preventDefault()}>
                {this.props.userInfo.email}
              </a>
            </Dropdown>
          ) : (
            <>
              <Link to="/login">
                <h5>登录</h5>
              </Link>
              <Link to="/register">
                <h5>注册</h5>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
}

const HeaderContainer = connect(state => ({
  userInfo: state.common.userInfo
}))(Header);
export default HeaderContainer;
