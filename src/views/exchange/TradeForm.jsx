import React from "react";
import { Form, Input, Button } from "antd";

const TradeForm = props => {
  const onFinish = () => {};
  const onFinishFailed = () => {};
  const formRef = React.createRef();

  return (
    <div className="trade-form">
      <h3 className="table-title">{props.title}</h3>
      <Form
        className="trade-form-content"
        ref={formRef}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="balance-wrapper">
          <span>余额</span>
          <span></span>
        </div>

        <Form.Item label="价格" name="price">
          <Input className="form-input" />
        </Form.Item>

        <Form.Item label="数量" name="amount">
          <Input className="form-input" />
        </Form.Item>

        <div className="block-wrapper">
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>

        <Form.Item label="合计" name="total">
          <Input className="form-input" />
        </Form.Item>

        <div>
          <span>手续费</span>
          <span></span>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="button">
            {props.btnText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TradeForm;
