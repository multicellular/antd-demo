import React from "react";

import { Row, Col } from "antd";

const RowTable = props => {
  const { rows = [], headers = [] } = props;
  return (
    <div className="table-wrapper">
      <Row className="table-header">
        {headers.map(head => (
          <Col span={24 / headers.length} key={head}>
            {head.format && head.format() ? head.format() : head}
          </Col>
        ))}
      </Row>
      <div className="table-body">
        {rows.map((row, index) => (
          <Row key={row.tid || index} className="table-row">
            {props.render(row)}
          </Row>
        ))}
      </div>
    </div>
  );
};

export default RowTable;
