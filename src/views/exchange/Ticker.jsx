import React from "react";
import { connect } from "react-redux";

import { Tabs, Row, Col, Popover } from "antd";
import { getTickers } from "@stores/actions";

const { TabPane } = Tabs;

class Ticker extends React.Component {
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
    this.props.getTickers().then(() => {
      this.list = this.props.tickers || [];
      this.setTabs(this.list);
    });
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
          <Col span={8}>市场</Col>
          <Col span={8}>价格</Col>
          <Col span={8}>24h 涨跌</Col>
        </Row>
      ),
      Body: props => {
        // const list = props.list;
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
    const { tabs, curList, curTab } = this.state;
    const quotes = this.props.quotes;
    const price = quotes[curTab] ? quotes[curTab]["rfinex_CNY"] : 0;
    return (
      <div className="ticker-wrapper">
        <Tabs onChange={this.handleTabChange}>
          {tabs.map(tab => (
            <TabPane tab={tab.toUpperCase()} key={tab}></TabPane>
          ))}
        </Tabs>
        <div className="table-wrapper">
          <Table.Header></Table.Header>
          <Table.Body list={curList} price={price}></Table.Body>
        </div>
      </div>
    );
  }
}

const TickerWidget = connect(
  state => ({
    tickers: state.common.tickers,
    quotes: state.common.quotes
  }),
  dispatch => ({
    getTickers() {
      return dispatch(getTickers());
    }
  })
)(Ticker);
export default TickerWidget;
