import React from "react";
import Banner from "./Banner";
import Content from "./Content";
import Turnover from "./Turnover";
import "./less/index.less";
import { BaseApi } from "@apis";
import { getQuotes } from "@stores/actions";
import { connect } from "react-redux";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
      notice: {}
    };
  }

  componentDidMount() {
    this.props.getQuotes({
      symbols: "CNST,ETH,USDT,FNB",
      currency: "CNY,USD",
      source: "rfinex,coinmarketcap"
    });
    BaseApi.getBanners({ platform: "pc" }).then(res => {
      this.setState({ banners: res });
    });
    BaseApi.getNotice().then(res => {
      this.setState({ notice: res });
    });
  }

  render() {
    const Notice = props => (
      <div className="notice-wrapper">
        <h3>公告</h3>
        {props.children}
        <a href={props.href} target="_blank" rel="noopener noreferrer">
          更多
        </a>
      </div>
    );
    const { banners, notice = {} } = this.state;

    return (
      <div className="home-page">
        <Banner list={banners} />
        <div className="content-wrapper">
          <Notice href={notice.notice_url}>{notice.title}</Notice>
          <Content />
          <Turnover title="成交额排行" len={8} isShowChart />
          <Turnover title="成交量排行" sortCallback={(a, b) => b.vol - a.vol} />
          <Turnover title="涨幅榜" sortCallback={(a, b) => b.ratio - a.ratio} />
          <div className="title-wrapper"></div>
        </div>
      </div>
    );
  }
}

const HomeWidget = connect(null, dispatch => ({
  getQuotes(req) {
    return dispatch(getQuotes(req));
  }
}))(Home);

export default HomeWidget;
