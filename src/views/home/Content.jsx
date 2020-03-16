import React, { useState, useContext, useEffect } from "react";
import { Tabs, Row, Col } from "antd";
import { getTickers, GlobalContext } from "@stores/hookActions";

const { TabPane } = Tabs;

const Content = () => {
  const [curTab, setCurTab] = useState("");
  const [curTickers, setCurTickers] = useState([]);
  const [tabs, setTabs] = useState([]);
  let [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch(getTickers()).then(() => {
      getTabs();
    });
  }, [dispatch]);

  // const linkSocket = () => {
  //   // Socket.onEvt("ticker", res => {
  //   //   this.updateTickers(res);
  //   // });
  //   // Socket.emit({"sub":"market.btcusdt.detail","symbol":"btcusdt"});
  // };

  // const updateTickers = data => {
  //   const idx = tickers.findIndex(ticker => ticker.name === data.symbol);
  //   if (idx > -1) {
  //     // console.log(tickers[idx].ticker,res,'SET_TICKERS_LIST_SINGLE');
  //     data.vol = data.volume || data.vol || 0;
  //     const ticker = tickers[idx].ticker;
  //     const isSame =
  //       ticker.vol === data.vol &&
  //       ticker.last === data.last &&
  //       ticker.high === data.high &&
  //       ticker.low === data.low &&
  //       ticker.open === data.open;
  //     if (!isSame) {
  //       tickers[idx].ticker = data;
  //       dispatch({ type: actions.SET_TICKERS, payload: tickers });
  //     }
  //   }
  // };

  function getTabs() {
    const tickers = state.tickers || [];
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
    const tickers = state.tickers || [];
    setCurTab(tab);
    const list = tickers.filter(item => item.quote === tab);
    setCurTickers(list);
  }

  const Table = {
    Header: () => (
      <Row className="table-header">
        <Col span={4}>市场</Col>
        <Col span={4}>最新价</Col>
        <Col span={4}>24h 成交量</Col>
        <Col span={4}>24h 最高价</Col>
        <Col span={4}>24h 最低价</Col>
        <Col span={4}>24h 涨跌</Col>
      </Row>
    ),
    Body: props => {
      const { list, price } = props;
      return (
        <div>
          {list.map(item => (
            <Row key={item.name} className="table-row">
              <Col className="row-name" span={4}>
                {item.code.toUpperCase()}/{item.quote.toUpperCase()}
              </Col>
              <Col className="row-color" span={4}>
                {item.ticker.last}
                <span className="row-color-gray">
                  /¥{price > 0 ? (price * item.ticker.last).toFixed(2) : 0}
                </span>
              </Col>
              <Col span={4}>
                {item.ticker.vol}
                <span className="row-color-gray">
                  {item.code.toUpperCase()}
                </span>
              </Col>
              <Col span={4}>{item.ticker.high}</Col>
              <Col span={4}>{item.ticker.low}</Col>
              <Col className="row-color" span={4}>
                {(
                  (item.ticker.last - item.ticker.open) /
                  item.ticker.open
                ).toFixed(2)}
                %
              </Col>
            </Row>
          ))}
        </div>
      );
    }
  };

  const quotes = state.quotes || {};
  const price = quotes[curTab] ? quotes[curTab]["rfinex_CNY"] : 0;

  return (
    <div>
      <h3>交易对</h3>
      <Tabs onChange={handleTabChange}>
        {tabs.map(tab => (
          <TabPane tab={tab.toUpperCase()} key={tab}></TabPane>
        ))}
      </Tabs>
      <Table.Header></Table.Header>
      <Table.Body list={curTickers} price={price}></Table.Body>
    </div>
  );
};

export default Content;
