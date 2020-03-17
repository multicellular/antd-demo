import React, { useState, useContext, useEffect } from "react";

import { BaseApi } from "@apis";
// import "@libs/charting_library/charting_library.min.js";
import Datafeeds from "@libs/datafeed.js";
import { GlobalContext } from "@stores/hookActions";

const KLine = props => {
  let marketName = props.marketName || "btccnst",
    datafeed,
    widget,
    curResolution = 60;
  const [ticker, setTicker] = useState({ ticker: {} });
  const [state] = useContext(GlobalContext);

  useEffect(() => {
    initChart();
  }, [marketName]);

  useEffect(() => {
    const tickers = state.tickers || [];
    const ticker = tickers.find(ticker => ticker.name === marketName) || {
      ticker: {}
    };
    setTicker(ticker);
  }, [marketName, state.tickers]);

  function initChart() {
    BaseApi.getKChart({ market: marketName }).then(res => {
      randerChart(res, marketName);
    });
  }

  function randerChart(data, marketName) {
    // let windowWidth = window.outerWidth;
    // if (windowWidth > 768) {
    //   localStorage["tradingview.IntervalWidget.quicks"] = JSON.stringify({
    //     "1": 1,
    //     "15": 1,
    //     "30": 1,
    //     "60": 1,
    //     "240": 1,
    //     "720": 1,
    //     "1D": 1,
    //     "1W": 1,
    //     "1M": 1
    //   });
    // } else {
    //   localStorage["tradingview.IntervalWidget.quicks"] = "";
    // }
    const TradingView = window.TradingView;
    // zh en ja ko
    let localMode = "zh";
    // switch (this.global.language) {
    //   case "zh-CN":
    //     localMode = "zh";
    //     break;
    //   case "en":
    //     localMode = "en";
    //     break;
    //   case "jap":
    //     localMode = "ja";
    //     break;
    //   case "kor":
    //     localMode = "ko";
    //     break;
    // }
    datafeed = new Datafeeds({
      name: marketName,
      data: data,
      resolution: curResolution,
      theme: "Light",
      locale: localMode
    });
    widget = new TradingView.widget(datafeed.config);
    // console.log(this.widget)
    widget.onChartReady(() => {
      //   localStorage["tradingview.current_theme.name"] = this.global.mode;
      curResolution = 60;
      const color = ["#965fc4", "#84aad5", "#55b263", "#b7248a", "#4f1ab7"];
      [7, 25, 60, 99].forEach((item, index) => {
        widget
          .chart()
          .createStudy("Moving Average", !1, !1, [item], function() {}, {
            "plot.color.0": color[index]
          });
      });
      //   this.Datafeed.setIntervalCheckoutCallBack(this.reloadChart);
    });
  }

  return (
    <>
      <div className="kline-header">
        <div className="market-name">
          {ticker.code}/{ticker.quote}
        </div>
        <div>
          <div className="lab">最新价</div>
          <div>{ticker.ticker.last}</div>
        </div>
        <div>
          <div className="lab">24h成交量</div>
          <div>{ticker.ticker.vol}</div>
        </div>
        <div>
          <div className="lab">24h最高价</div>
          <div>{ticker.ticker.high}</div>
        </div>
        <div>
          <div className="lab">24h最低价</div>
          <div>{ticker.ticker.low}</div>
        </div>
        <div>
          <div className="lab">24h涨跌</div>
          <div>
            {(
              (ticker.ticker.last - ticker.ticker.open) /
              ticker.ticker.open
            ).toFixed(2)}
            %
          </div>
        </div>
      </div>
      <div className="chart-box" id="tv_chart_container"></div>
    </>
  );
};

export default KLine;
