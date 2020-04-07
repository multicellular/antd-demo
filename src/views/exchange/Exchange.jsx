import React, { useState, useContext, useEffect } from "react";
import { Col } from "antd";

import { BaseApi } from "@apis/index";
import Ticker from "./Ticker";
import KLine from "./KLine";
import DataTable from "./DataTable";
import TradeForm from "./TradeForm";
import "./less/index.less";

import { getQuotes, GlobalContext } from "@stores/hookActions";

const Exchange = () => {
  const [trades, setTrades] = useState([]);
  const [depths, setDepths] = useState([]);
  const [marketName, seMarketName] = useState("btccnst");
  const [, dispatch] = useContext(GlobalContext);
  // const marketName = "btccnst";

  useEffect(() => {
    dispatch(
      getQuotes({
        symbols: "CNST,ETH,USDT,FNB",
        currency: "CNY,USD",
        source: "rfinex,coinmarketcap"
      })
    );
  }, []);

  useEffect(() => {
    BaseApi.getTrades({
      market: marketName,
      limit: "30"
    }).then(res => {
      setTrades(res);
    });
    BaseApi.getDepth({
      market: marketName,
      limit: "10"
    }).then(res => {
      setDepths(res);
    });
  }, [marketName]);

  const clickTicker = ticker => e => {
    seMarketName(ticker.name);
  };

  return (
    <div className="exchange-page">
      <div>
        <h3 className="table-title">市场</h3>
        <Ticker handleClick={clickTicker} />
        <h3 className="table-title">最近成交</h3>
        <DataTable
          headers={["时间", "数量", "价格"]}
          rows={trades}
          render={row => (
            <>
              <Col span={8}>{row.date}</Col>
              <Col span={8}>{row.amount}</Col>
              <Col className="row-color" span={8}>
                {row.price}
              </Col>
            </>
          )}
        />
      </div>
      <div className="wrapper">
        <KLine marketName={marketName}/>
        <div className="trade-form-wrapper">
          <TradeForm title="买入BTC" btnText="买入" />
          <TradeForm title="卖出BTC" btnText="卖出" />
        </div>
      </div>
      <div className="wrapper">
        <h3 className="table-title">挂单</h3>
        <DataTable
          headers={["价格(CNST)", "数量(BTC)", "累计(BTC)"]}
          rows={depths.asks}
          render={row => (
            <>
              <Col className="row-color" span={8}>
                {row[0]}
              </Col>
              <Col span={8}>{row[1]}</Col>
            </>
          )}
        />
        <h3 className="table-title">5123≈1231</h3>
        <DataTable
          rows={depths.bids}
          render={row => (
            <>
              <Col className="row-color" span={8}>
                {row[0]}
              </Col>
              <Col span={8}>{row[1]}</Col>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Exchange;
