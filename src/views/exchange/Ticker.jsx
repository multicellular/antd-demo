import React, { useState, useContext, useEffect } from "react";
import { Tabs, Row, Col, Popover } from "antd";
import { getTickers, GlobalContext } from "@stores/hookActions";

const { TabPane } = Tabs;

const Ticker = () => {
  const [curTab, setCurTab] = useState("");
  const [curTickers, setCurTickers] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch(getTickers()).then(() => {
      getTabs();
    });
  }, []);

  function getTabs() {
    const tickers = state.tickers;
    let tabs = [];
    tickers.forEach(ticker => {
      if (tabs.indexOf(ticker.quote) < 0) {
        tabs.push(ticker.quote);
      }
    });
    setTabs(tabs);
    handleTabChange(tabs[0]);
  }

  function handleTabChange(tab) {
    const tickers = state.tickers;
    setCurTab(tab);
    const list = tickers.filter(item => item.quote === tab);
    setCurTickers(list);
  }

  const Table = {
    Header: () => (
      <Row className="table-header">
        <Col span={8}>市场</Col>
        <Col span={8}>价格</Col>
        <Col span={8}>24h 涨跌</Col>
      </Row>
    ),
    Body: props => {
      const { list, price } = props;
      return (
        <div className="table-body">
          {list.map(item => (
            <Popover
              content={
                "¥" + (price > 0 ? (price * item.ticker.last).toFixed(2) : 0)
              }
              placement="right"
              key={item.name}
            >
              <Row className="table-row">
                <Col className="row-name" span={8}>
                  {item.code.toUpperCase()}/{item.quote.toUpperCase()}
                </Col>
                <Col span={8}>{item.ticker.last}</Col>
                <Col className="row-color" span={8}>
                  {(
                    (item.ticker.last - item.ticker.open) /
                    item.ticker.open
                  ).toFixed(2)}
                  %
                </Col>
              </Row>
            </Popover>
          ))}
        </div>
      );
    }
  };

  const quotes = state.quotes || {};
  const price = quotes[curTab] ? quotes[curTab]["rfinex_CNY"] : 0;

  return (
    <div className="ticker-wrapper">
      <Tabs onChange={handleTabChange}>
        {tabs.map(tab => (
          <TabPane tab={tab.toUpperCase()} key={tab}></TabPane>
        ))}
      </Tabs>
      <div className="table-wrapper">
        <Table.Header></Table.Header>
        <Table.Body list={curTickers} price={price}></Table.Body>
      </div>
    </div>
  );
};

export default Ticker;
