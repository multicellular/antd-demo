class Datafeed {
    constructor(info) {
        this.data = info.data
        this.resolution = this.defaultResolution()
        this.defaultConfig = this.defaultConfiguration()
        this.defaultSymbol = {}
        this.subscriberList = {}
        this.neededCallback = {}
        this.intervalCheckoutCallBack = ''
    }
    handleResolutionDate(resolution, time){
        let localTime = time
        if(resolution.includes('D') || resolution.includes('W')){
            localTime = time
        }else if(resolution.includes('M')){
            localTime = time
        }
        return localTime
    }
    onReady(callback){
        setTimeout(() => {
            callback(this.defaultConfig);
        }, 0);
    }
    resolveSymbol(symbolName, onSymbolResolvedCallback){
        this.defaultSymbol = this.getDefaultSymbol(symbolName)
        setTimeout(() => {
            onSymbolResolvedCallback(this.defaultSymbol);
        }, 0);
    }
    getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback){
        new Promise((resolve) => {
            if(this.intervalCheckoutCallBack){
                this.intervalCheckoutCallBack(resolution, resolve)
            }else {
                resolve()
            }
        }).then(() => {
            if(!this.data[this.resolution[resolution]]){
                onDataCallback([], { noData: true })
                return
            }
            let list = []
            for(let i = 0; i < this.data[this.resolution[resolution]].length; i++){
                if(
                    i !== 0 &&
                    this.data[this.resolution[resolution]][i][0] <= this.data[this.resolution[resolution]][i - 1][0]){
                    continue
                }
                let element = this.data[this.resolution[resolution]][i]
                let time = this.handleResolutionDate(resolution, parseInt(element[0]) * 1000)
                list.push({
                    time: time,
                    open: +element[1],
                    high: +element[2],
                    low: +element[3],
                    close: +element[4],
                    volume: +element[5]
                })
            }
            if(list.length > 0 && (list[0].time < rangeEndDate * 1000)){
                onDataCallback(list, { noData: false })
            }else {
                onDataCallback([], { noData: true })
            }
        })
    }
    /* eslint-disable */
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback){
        this.subscriberList[subscriberUID] = onRealtimeCallback
        this.neededCallback[subscriberUID] = onResetCacheNeededCallback
    }
    unsubscribeBars(subscriberUID) {
        delete this.subscriberList[subscriberUID]
        delete this.neededCallback[subscriberUID]
    }
    updateBar(name, resolution, bar){
        if(this.subscriberList[name + '_' + resolution]){
            if(bar){
                this.subscriberList[name + '_' + resolution]({
                    time: parseInt(bar[0]) * 1000,
                    open: +bar[1],
                    high: +bar[2],
                    low: +bar[3],
                    close: +bar[4],
                    volume: +bar[5]
                })
            }
        }
    }
    needCacheCallBack(name, resolution){
        if(!this.neededCallback[name + "_" + resolution]) return
        this.neededCallback[name + "_" + resolution]()
    }
    /* eslint-enable */
    setIntervalCheckoutCallBack(callback){
        this.intervalCheckoutCallBack = callback
    }
    defaultResolution() {
        return {
            1: "k1",
            5: "k5",
            15: "k15",
            30: "k30",
            60: "k60",
            120: "k120",
            240: "k240",
            360: "k360",
            720: "k720",
            '1D': "k1440",
            '3D': "k4320",
            '1W': "k10080",
            '1M': "k1M",
        };
    }
    defaultConfiguration() {
        return {
            supports_search: false,
            supports_group_request: false,
            supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M'],
            supports_marks: true,
            supports_timescale_marks: true,
            supports_time: true
        };
    }
    getDefaultSymbol(name) {
        // let supported_resolutions = []
        // let dataKeys = Object.keys(this.data)
        // let resolutionKeys = Object.keys(this.resolution)
        // let resolutionValues = Object.values(this.resolution)
        // dataKeys.forEach(v => {
        //     let index = resolutionValues.findIndex(v1 => v1 === v)
        //     if(index >=0 && this.data[v] && this.data[v].length > 0){
        //         supported_resolutions.push(resolutionKeys[index])
        //     }
        // })
        return {
            'name': name,
            'minmov': true,
            'minmov2': false,
            'pointvalue': true,
            'fractional': false,
            'timezone': 'Asia/Shanghai',
            //设置周期
            'session': '24x7',
            'has_intraday': true,
            'has_no_volume': false,
            //设置是否支持周月线
            "has_weekly_and_monthly":true,
            //设置精度  100表示保留两位小数   1000三位   10000四位
            'pricescale': 1e8,
            'supported_resolutions': ['1', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M'],
        }
    }
}

class Widget{
    constructor(widget){
        this.widgetInstance = new Datafeed(widget)
        this.config = {
            symbol: widget.name,
            interval: widget.resolution,
            container_id: 'tv_chart_container',
            datafeed: this.widgetInstance,
            // library_path: `${process.env.BASE_URL}charting_library/`,
            library_path: `/charting_library/`,
            enabled_features: [
                "hide_last_na_study_output",
                "hide_left_toolbar_by_default",
                "dont_show_boolean_study_arguments",
                "move_logo_to_main_pane"
            ],
            theme: widget.theme,
            autosize: true,
            timezone: 'Asia/Singapore',
            locale: 'zh',
            debug: false,
            custom_css_url: `./custom_css/${widget.theme.toLowerCase()}.css`,
            disabled_features: [
                "header_symbol_search",
                "header_screenshot",
                "header_chart_type",
                "header_compare",
                "header_undo_redo",
                "timeframes_toolbar",
                "volume_force_overlay",
                "countdown",
                "display_market_status",
                "edit_buttons_in_legend",
                "legend_context_menu",
                "control_bar",
                "header_settings",
                "header_fullscreen_button"
            ],
            overrides: {
                "volumePaneSize": "small",
                "paneProperties.topMargin": 30,
                "paneProperties.bottomMargin": 5,
                "paneProperties.background": widget.theme === 'Light' ? "#fafafa" : "#323232",
                "paneProperties.legendProperties.showSeriesTitle": 0,
                "paneProperties.vertGridProperties.color": widget.theme === 'Light' ? "#eeeeee" : "#363636",
                "paneProperties.vertGridProperties.style": 0,
                "paneProperties.horzGridProperties.color": widget.theme === 'Light' ? "#eeeeee" : "#363636",
                "paneProperties.horzGridProperties.style": 0,
                "paneProperties.crossHairProperties.color": widget.theme === 'Light' ? "#989898" : "#535353",

                "scalesProperties.lineColor": widget.theme === 'Light' ? "#d2d2d2" : "#6f6f6f",
                "scalesProperties.textColor": "#9a9a9a",
                "mainSeriesProperties.style": 1,
                "mainSeriesProperties.candleStyle.borderColor": "#C400CB",
                "mainSeriesProperties.candleStyle.borderDownColor": "#ed6679",
                "mainSeriesProperties.candleStyle.borderUpColor": "#47be82",
                "mainSeriesProperties.candleStyle.downColor": "#ed6679",
                "mainSeriesProperties.candleStyle.drawBorder": 1,
                "mainSeriesProperties.candleStyle.drawWick": 1,
                "mainSeriesProperties.candleStyle.upColor": "#47be82",
                "mainSeriesProperties.candleStyle.wickDownColor": "#ed6679",
                "mainSeriesProperties.candleStyle.wickUpColor": "#47be82",
                "mainSeriesProperties.candleStyle.barColorsOnPrevClose": 0,
            },
            customFormatters:{
                dateFormatter: {
                    format: function(date) {
                        return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate()
                    }
                }
            }
        }

    }
    setIntervalCheckoutCallBack(callback){
        this.widgetInstance.setIntervalCheckoutCallBack(callback)
    }
    updateBar(name, resolution, bar){
        this.widgetInstance.updateBar(name, resolution, bar)
    }
    needCacheCallBack(name, resolution){
        this.widgetInstance.needCacheCallBack(name, resolution)
    }
}

export default Widget