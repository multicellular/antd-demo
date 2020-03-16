import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import "./less/notfound.less";

// 声明组件  并对外输出
export default class notfound extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      // activeTab: 'pop' ,
    };
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="notfound-wrapper">
        <Skeleton avatar paragraph={{ rows: 4 }} />

        <div className="link ptbig">
          <p className="mbbig">
            <Link to="/">跳转至首页</Link>
          </p>
        </div>
      </div>
    );
  }
}
