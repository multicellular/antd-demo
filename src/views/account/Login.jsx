import React, { useState, useContext, useEffect, useRef } from "react";
import { BaseApi, AccountApi } from "@apis";
import { Form, Input, Modal, Button, Checkbox, Tabs, message } from "antd";
import "@libs/gt";
import "./less/login.less";

import actions, { GlobalContext } from "@stores/hookActions";

const { TabPane } = Tabs;

const Login = props => {
  const [, dispatch] = useContext(GlobalContext);
  const History = props.history;
  const [geetestLoading, setLoading] = useState(true);
  const [activeKey, setKey] = useState("email");
  const [dialogVisible, setVisible] = useState(false);
  const [isGoogleCheckBtnLoading, setGoogleCheckBtnLoading] = useState(false);
  const [userInfo, setUser] = useState("");
  let needGeetest = false,
    gt_server_status,
    user_id,
    otp = "";
  const formRef = useRef();
  const [onSubmit, setSubmit] = useState();

  useEffect(() => {
    geetest();
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  function onFinish(values) {
    console.log(onSubmit);
    if (onSubmit) {
      onSubmit();
    }
  }

  function onFinishFailed(error) {}

  function cancelCheckGoogle() {
    setUser("");
    setVisible(false);
  }

  function onTabChange(key) {
    setKey(key);
  }

  function goRegister() {}

  // const onClickLogin = () => {};

  const geetest = () => {
    const initGeetest = window.initGeetest;
    BaseApi.getGeeTest().then(data => {
      if (!data) {
        return;
      }
      setLoading(false);
      gt_server_status = data.success;
      user_id = data.user_id;
      // 使用initGeetest接口
      // 参数1：配置参数
      // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
      initGeetest(
        {
          width: "100%",
          gt: data.gt,
          challenge: data.challenge,
          product: "bind", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
          offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        },
        geetestHandler
      );
    });
  };

  const geetestHandler = captchaObj => {
    captchaObj
      .onReady(() => {
        //验证码ready之后才能调用verify方法显示验证码
      })
      .onSuccess(() => {
        postLogin(captchaObj);
      })
      .onError(() => {
        //your code
        captchaObj.reset();
      });
    let submit = () => () => {
      if (needGeetest) {
        captchaObj.verify();
      } else {
        postLogin(captchaObj);
      }
    };
    setSubmit(submit);
  };

  function postLogin(captchaObj) {
    var req = {
      password: formRef.current.getFieldValue("password")
    };
    if (needGeetest) {
      var validate = captchaObj.getValidate();
      req["gt_server_status"] = gt_server_status;
      req["user_id"] = user_id;
      req["geetest_validate"] = validate.geetest_validate;
      req["geetest_challenge"] = validate.geetest_challenge;
      req["geetest_seccode"] = validate.geetest_seccode;
    }
    // this.error.flag = false;
    if (activeKey === "email") {
      req.email = formRef.current.getFieldValue("email");
    } else {
      req.phone_number = formRef.current.getFieldValue("phone");
    }
    setUser("");
    AccountApi.login(req)
      .then(res => {
        if (!res.app_validated) {
          // 用户没绑两步验证
          dispatch({ type: actions.SET_USER, payload: res }).then(() => {
            History.push("/user/userSetting/info");
          });
          return;
        }
        // 输入两步验证
        setUser(res);
        setVisible(true);
      })
      .catch(error => {
        if (error.head.code === "1020") {
          //   this.error.flag = true;
          //   this.error.text = this.$t("login.error");
        } else if (error.head.code === "1044") {
          needGeetest = true;
          captchaObj.verify();
        } else {
          message.info((error.head && error.head.msg) || error);
        }
      });
  }

  function submitCheckGoogle() {
    setGoogleCheckBtnLoading(true);
    var formData = {
      otp: otp
    };
    BaseApi.checkOtp(formData, {
      token: userInfo.tokens[0].token,
      expire_at: userInfo.tokens[0].expire_at
    })
      .then(() => {
        dispatch({ type: actions.SET_USER, payload: userInfo });
        History.push("/");
      })
      .catch(error => {
        // this.$refs.google.resetCode();
        if (error.head.code === "2013") {
          // this.$message.closeAll();
          message.info((error.head && error.head.msg) || error);
        } else {
          message.info((error.head && error.head.msg) || error);
        }
        setGoogleCheckBtnLoading(false);
      });
  }

  function handleOtpChange(e) {
    otp = e.target.value;
  }

  return (
    <div className="login-wrapper">
      <div className="login-content">
        <p className="login-title">Login</p>
        <Form
          ref={formRef}
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={onTabChange}
          >
            <TabPane tab="email" key="email">
              <Form.Item
                label="email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" }
                ]}
              >
                <Input />
              </Form.Item>
            </TabPane>
            <TabPane tab="phone" key="phone">
              <Form.Item
                label="Phone"
                name="Phone"
                rules={[
                  { required: true, message: "Please input your Phone!" }
                ]}
              >
                <Input />
              </Form.Item>
            </TabPane>
          </Tabs>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={geetestLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="tip-register">
          <router-link className="forget-pwd" to="/forgetpwd">
            login.forget-pw
          </router-link>

          <span className="register-link" onClick={goRegister}>
            login.register
          </span>
        </div>
      </div>
      <GoogleCheck
        //   ref="google"
        confirmLoading={isGoogleCheckBtnLoading}
        onCancel={cancelCheckGoogle}
        onOk={submitCheckGoogle}
        visible={dialogVisible}
        onChange={handleOtpChange}
      />
    </div>
  );
};

function GoogleCheck(props) {
  return (
    <Modal
      title="Enter Otp"
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      confirmLoading={props.confirmLoading}
    >
      <div className="form-content">
        <Input placeholder="Basic usage" onChange={props.onChange} />
        {/* <vue-input-code ref="vueInput" span-size="24px" :success="inputComplete" type="number" :number="6" height="40px" span-color="#0079ff" input-color="#0079ff" input-size="24px" :code="code"></vue-input-code> */}
      </div>
      <span className="dialog-tip">enter-otp-tip</span>
    </Modal>
  );
}

export default Login;
