import React from "react";
import { connect } from "react-redux";

import { Tabs, Row, Col } from "antd";
import { setTickers, getTickers } from "@stores/actions";
// import Socket from "@apis/socket";

const { TabPane } = Tabs;

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curTab: "",
      curList: [],
      tabs: []
    };
    this.list = this.props.tickers || [];
  }

  componentDidMount() {
    this.getTickers();
  }

  getTickers = () => {
    this.props.getTickers().then(() => {
      this.list = this.props.tickers || [];
      this.setTabs(this.list);
    });
  };

  linkSocket() {
    // Socket.onEvt("ticker", res => {
    //   this.updateTickers(res);
    // });
    // Socket.emit({"sub":"market.btcusdt.detail","symbol":"btcusdt"});
  }

  updateTickers(data) {
    let tickers = this.props.tickers || [];
    const idx = tickers.findIndex(ticker => ticker.name === data.symbol);
    if (idx > -1) {
      // console.log(tickers[idx].ticker,res,'SET_TICKERS_LIST_SINGLE');
      data.vol = data.volume || data.vol || 0;
      const ticker = tickers[idx].ticker;
      const isSame =
        ticker.vol === data.vol &&
        ticker.last === data.last &&
        ticker.high === data.high &&
        ticker.low === data.low &&
        ticker.open === data.open;
      if (!isSame) {
        tickers[idx].ticker = data;
        this.setTickers(tickers);
        // state.originTickerList = tickers;
      }
    }
  }
  setTabs(tickers) {
    let tabs = [];
    tickers.forEach(ticker => {
      if (tabs.indexOf(ticker.quote) < 0) {
        tabs.push(ticker.quote);
      }
    });
    this.setState({
      tabs
    });
    this.handleTabChange(tabs[0]);
  }

  handleTabChange = tab => {
    this.setState({
      curTab: tab
    });
    const list = this.list.filter(item => item.quote === tab);
    this.setState({
      curList: list
    });
  };

  render() {
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
        // const list = props.list;
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
    const { tabs, curList, curTab } = this.state;
    const quotes = this.props.quotes;
    const price = quotes[curTab] ? quotes[curTab]["rfinex_CNY"] : 0;
    return (
      <div>
        <h3>交易对</h3>
        <Tabs onChange={this.handleTabChange}>
          {tabs.map(tab => (
            <TabPane tab={tab.toUpperCase()} key={tab}></TabPane>
          ))}
        </Tabs>
        <Table.Header></Table.Header>
        <Table.Body list={curList} price={price}></Table.Body>
      </div>
    );
  }
}

const ContentWidget = connect(
  state => ({
    tickers: state.common.tickers,
    quotes: state.common.quotes
  }),
  dispatch => ({
    getTickers() {
      return dispatch(getTickers());
    },
    setTickers(tickers) {
      return dispatch(setTickers(tickers));
    }
  })
)(Content);
export default ContentWidget;
