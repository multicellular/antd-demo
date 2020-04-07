import React, { useContext } from "react";
import AreaChart from "./area-chart";

import { GlobalContext } from "@stores/hookActions";

const Turnover = props => {
  const [{ tickers, quotes }] = useContext(GlobalContext);

  const Content = obj => (
    <div className="card">
      <div className="bg-chart">{obj.bgChart}</div>
      <div className="card-content">
        <div className="card-header">{obj.top}</div>
        <div className="amount">{obj.amount}</div>
        <div className="price">{obj.price}</div>
        <div className="ratio">%{obj.ratio}</div>
      </div>
    </div>
  );

  const mapTickers = tickers.map(item => {
    const price =
      item.ticker.open *
      (quotes[item.quote] ? quotes[item.quote]["rfinex_CNY"] : 0);
    return {
      name: item.name,
      code: item.code,
      quote: item.quote,
      turnover: price * item.ticker.vol,
      vol: item.ticker.vol,
      ratio: ((item.ticker.last - item.ticker.open) / item.ticker.open).toFixed(
        2
      )
    };
  });

  const sortCallback =
    props.sortCallback || ((a, b) => b.turnover - a.turnover);
  const len = props.len || 4;
  const sortTickers = mapTickers.sort(sortCallback).splice(0, len);
  const isShowChart = props.isShowChart;

  return (
    <div className="turnover-wrapper">
      <h3>{props.title}</h3>
      <div className="card-wrapper">
        {sortTickers.map(ticker => (
          <Content
            key={ticker.name}
            top={
              <>
                <span className="weight">{ticker.code.toUpperCase()}</span>
                <span>/{ticker.quote}</span>
              </>
            }
            amount={
              <span>
                {ticker.vol} {ticker.quote.toUpperCase()}
              </span>
            }
            price={<span>≈ ¥{ticker.turnover}</span>}
            ratio={ticker.ratio}
            bgChart={
              isShowChart && (
                <AreaChart
                  key={ticker.name}
                  tickerName={ticker.name}
                ></AreaChart>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Turnover;
