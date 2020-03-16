import React from "react";
import { BaseApi } from "@apis";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";

class AreaChart extends React.PureComponent {
  componentDidMount() {
    this.initChart();
    this.getData();
  }
  componentWillUnmount() {
    if (this.chart && this.chart.destroy) {
      this.chart.destroy();
    }
  }
  initChart() {
    this.eChart = echarts.init(document.getElementById(this.props.tickerName));
    this.eChart.setOption({
      animation: false,
      grid: {
        top: "50%",
        left: "0%",
        right: "0%",
        bottom: "0%",
        containLabel: false
      },
      xAxis: [
        {
          type: "category",
          show: false,
          boundaryGap: false,
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          show: false,
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          type: "line",
          smooth: true,
          showSymbol: false,
          hoverAnimation: false,
          areaStyle: {
            color: "rgba(217,235,255,0.9)"
          },
          lineStyle: { color: "rgba(217,235,255,0.9)", width: 1.2 }
        }
      ]
    });
  }

  getData() {
    BaseApi.getTickerK({
      market: this.props.tickerName,
      period: 60,
      timestamp: parseInt(new Date().getTime() / 1000) - 3600 * 24
    }).then(res => {
      if (!res || !res.length) {
        return;
      }
      this.eChart.setOption({
        series: [
          {
            data: res.map(function(item) {
              return [item[0], item[5]];
            })
          }
        ]
      });
    });
  }

  render() {
    return <div id={this.props.tickerName} className="area-chart"></div>;
  }
}

export default AreaChart;
