import React from "react";
import { connect } from "react-redux";
import { setUserInfo } from "@stores/actions";
import { BaseApi, AccountApi } from "@apis";
import { Form, Input, Modal, Button, Checkbox, Tabs, message } from "antd";
import "@libs/gt";
import "./less/login.less";
const { TabPane } = Tabs;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dialogVisible: false,
      isGoogleCheckBtnLoading: false,
      needGeetest: false,
      //   error: {
      //     flag: false,
      //     text: "Hello"
      //   },
      loginForm: {
        phone: "",
        email: "",
        password: ""
      },
      //   gt_server_status: "",
      //   user_id: "",
      userInfo: "",
      geetestLoading: true,
      activeKey: "email",
      isChangeTab: false,
      otp: ""
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    // 极验证初始化
    this.geetest();
    console.log(this.props);
  }

  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 }
    };
    const onFinish = values => {
      //   this.postLogin();
      if (this.onSubmit) {
        this.onSubmit();
      }
    };
    const onFinishFailed = error => {};
    return (
      <div className="login-wrapper" loading="isLoading">
        <div className="login-content">
          <p className="login-title">Login</p>
          <Form
            ref={this.formRef}
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Tabs
              defaultActiveKey="1"
              activeKey={this.state.activeKey}
              onChange={this.onTabChange}
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
              rules={[
                { required: true, message: "Please input your password!" }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.geetestLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div className="tip-register">
            <router-link className="forget-pwd" to="/forgetpwd">
              login.forget-pw
            </router-link>

            <span className="register-link" onClick={this.goRegister}>
              login.register
            </span>
          </div>
        </div>
        <GoogleCheck
          //   ref="google"
          confirmLoading={this.state.isGoogleCheckBtnLoading}
          onCancel={this.cancelCheckGoogle}
          onOk={this.submitCheckGoogle}
          visible={this.state.dialogVisible}
          onChange={this.handleOtpChange}
        />
      </div>
    );
  }

  cancelCheckGoogle = () => {
    this.userInfo = "";
    this.setState({
      dialogVisible: false
    });
    // this.dialogVisible = false;
  };

  onTabChange = () => {};
  goRegister = () => {};

  onClickLogin = () => {};

  geetest() {
    var initGeetest = window.initGeetest;
    // this.geetestLoading = true;
    BaseApi.getGeeTest().then(data => {
      if (!data) {
        return;
      }
      // this.geetestLoading = false;
      this.setState({
        geetestLoading: false
      });
      this.gt_server_status = data.success;
      this.user_id = data.user_id;
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
        this.geetestHandler
      );
    });
  }

  geetestHandler = captchaObj => {
    captchaObj
      .onReady(() => {
        //验证码ready之后才能调用verify方法显示验证码
      })
      .onSuccess(() => {
        this.postLogin(captchaObj);
      })
      .onError(() => {
        //your code
        captchaObj.reset();
      });
    this.onSubmit = () => {
      if (this.needGeetest) {
        captchaObj.verify();
      } else {
        this.postLogin(captchaObj);
      }
      //   this.$refs.form.validate(valid => {
      //     if (valid) {
      //       if (this.needGeetest) {
      //         captchaObj.verify();
      //       } else {
      //         this.postLogin(captchaObj);
      //       }
      //     } else {
      //       return false;
      //     }
      //   });
    };
  };

  postLogin = captchaObj => {
    var req = {
      // email: this.loginForm.email,
      password: this.formRef.current.getFieldValue("password")
    };
    if (this.needGeetest) {
      var validate = captchaObj.getValidate();
      req["gt_server_status"] = this.gt_server_status;
      req["user_id"] = this.user_id;
      req["geetest_validate"] = validate.geetest_validate;
      req["geetest_challenge"] = validate.geetest_challenge;
      req["geetest_seccode"] = validate.geetest_seccode;
    }
    // this.error.flag = false;
    this.isLoading = true;
    if (this.state.activeKey === "email") {
      req.email = this.formRef.current.getFieldValue("email");
    } else {
      req.phone_number = this.formRef.current.getFieldValue("phone");
    }
    this.userInfo = "";
    // this.$store
    //   .dispatch("Login", req)
    AccountApi.login(req)
      .then(res => {
        this.isLoading = false;
        // this.redirect = decodeURIComponent(this.$route.query.redirect || "/");
        // const backUrl = this.$route.query.back_url;
        // if (!res.activated && !res.sms_validated) {
        //   // 用户没绑邮箱或者手机号
        //   let params = {
        //     userInfo: res,
        //     redirect: this.redirect
        //   };
        //   if (backUrl) {
        //     // 从其他应用入口来
        //     params["backUrl"] = true;
        //     params["href"] = decodeURIComponent(backUrl);
        //   }
        //   this.$router.push({
        //     name: "activaemail",
        //     params
        //   });
        //   return;
        // }
        if (!res.app_validated) {
          // 用户没绑两步验证
          this.$store.dispatch("SetInfo", res).then(() => {
            // if (backUrl) {
            //   // 如果从其他应用入口来的
            //   location.href = decodeURIComponent(backUrl);
            //   return;
            // }
            this.props.history.push("/user/userSetting/info");
          });
          return;
        }
        // 输入两步验证
        this.userInfo = res;
        this.setState({
          dialogVisible: true
        });
      })
      .catch(error => {
        if (error.head.code === "1020") {
          //   this.error.flag = true;
          //   this.error.text = this.$t("login.error");
        } else if (error.head.code === "1044") {
          this.needGeetest = true;
          captchaObj.verify();
        } else {
          message.info((error.head && error.head.msg) || error);
        }
        this.isLoading = false;
      });
  };

  submitCheckGoogle = () => {
    this.isGoogleCheckBtnLoading = true;
    var formData = {
      otp: this.state.otp
    };
    BaseApi.checkOtp(formData, {
      token: this.userInfo.tokens[0].token,
      expire_at: this.userInfo.tokens[0].expire_at
    })
      .then(() => {
        this.props.setUserInfo(this.userInfo);
        // console.log(this.userInfo, 1231232);
        // this.$message.closeAll();
        // this.$store.dispatch("SetInfo", this.userInfo).then(() => {
        //   const backUrl = this.$route.query.back_url;
        //   if (backUrl) {
        //     // 如果从其他应用入口来的
        //     location.href = decodeURIComponent(backUrl);
        //     return;
        //   }
        this.props.history.push("/");
        // this.$router.push({ path: this.redirect });
        // });
      })
      .catch(error => {
        // this.$refs.google.resetCode();
        if (error.head.code === "2013") {
          // this.$message.closeAll();
          message.info((error.head && error.head.msg) || error);
          // message({
          //   showClose: true,
          //   duration: 10000,
          //   message: error.head.msg + this.$t("login.error-need-reset-time"),
          //   type: "error"
          // });
        } else {
          message.info((error.head && error.head.msg) || error);
        }
        this.isGoogleCheckBtnLoading = false;
      });
  };

  handleOtpChange = e => {
    this.setState({
      otp: e.target.value
    });
  };
}

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

export default connect(null, dispatch => ({
  setUserInfo(info) {
    dispatch(setUserInfo(info));
  }
}))(Login);
