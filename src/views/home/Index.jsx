import React, { useState, useContext, useEffect } from "react";
import Banner from "./banner";
import Content from "./content";
import Turnover from "./turnover";
import "./less/index.less";
import { BaseApi } from "@apis/index";
import { getQuotes, GlobalContext } from "@stores/hookActions";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [notice, setNotice] = useState({});
  const [, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch(
      getQuotes({
        symbols: "CNST,ETH,USDT,FNB",
        currency: "CNY,USD",
        source: "rfinex,coinmarketcap"
      })
    );
    BaseApi.getBanners({ platform: "pc" }).then(res => {
      setBanners(res || []);
    });
    BaseApi.getNotice().then(res => {
      setNotice(res || {});
    });
  }, [dispatch]);

  const Notice = props => (
    <div className="notice-wrapper">
      <h3>公告</h3>
      {props.children}
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        更多
      </a>
    </div>
  );

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
};

export default Home;
