import React from "react";
import { connect } from "react-redux";
import AreaChart from "./AreaChart";

class Turnover extends React.Component {
  render() {
    const Content = props => (
      <div className="card">
        <div className="bg-chart">{props.bgChart}</div>
        <div className="card-content">
          <div className="card-header">{props.top}</div>
          <div className="amount">{props.amount}</div>
          <div className="price">{props.price}</div>
          <div className="ratio">%{props.ratio}</div>
        </div>
      </div>
    );
    const { tickers, quotes } = this.props;
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
        ratio: (
          (item.ticker.last - item.ticker.open) /
          item.ticker.open
        ).toFixed(2)
      };
    });
    const sortCallback =
      this.props.sortCallback || ((a, b) => b.turnover - a.turnover);
    const len = this.props.len || 4;
    const sortTickers = mapTickers.sort(sortCallback).splice(0, len);
    const isShowChart = this.props.isShowChart;
    return (
      <div className="turnover-wrapper">
        <h3>{this.props.title}</h3>
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
                isShowChart && <AreaChart key={ticker.name} tickerName={ticker.name}></AreaChart>
              }
            />
          ))}
        </div>
      </div>
    );
  }
}

const TurnoverWidget = connect(state => ({
  tickers: state.common.tickers,
  quotes: state.common.quotes
}))(Turnover);

export default TurnoverWidget;
