
import * as React from 'react';
import './index.css';
import { connect } from 'react-redux';
import {subscribeBars, historyGetBars} from '../../../../../../../store/modules/chart';

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "1D"]

const config = {
    supported_resolutions: supportedResolutions
}; 


function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {
	widget = null;
    chart = null;


	static defaultProps = {
		containerId: 'tv_chart_container',
		//libraryPath: 'http://localhost:3000/public/charting_library/',
		libraryPath: '/chart/public/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {
			"volume.volume.color.0": "#d44b37",
			"volume.volume.color.1": "#45A678",
		}
	};
	

	onReday = (cb) => {
		setTimeout(() => cb(config), 0)
	}
	searchSymbols= (userInput, exchange, symbolType, onResultReadyCallback) => {
		//console.log('====Search Symbols running')
	}
	resolveSymbol = (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		var split_data = symbolName.split(/[:/]/)
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: split_data[0].toLowerCase(),
			minmov: 1,
			pricescale: Math.pow(10,this.props.pricePrecision),
			has_intraday: true,
		
			intraday_multipliers: ['1', '3', '5', '15', '30', '60', '120', '240', "D"],
			supported_resolution:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
		}

		// symbol_stub.pricescale = 100
		setTimeout(function() {
			
			onSymbolResolvedCallback(symbol_stub)
			//console.log('Resolving that symbol....', symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	}

	getBars = (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) =>{
		//console.log(resolution)
		this.props.historyGetBars({symbolInfo: symbolInfo, resolution: resolution,from:from,to:to,firstDataRequest:firstDataRequest,onHistoryCallback:onHistoryCallback,onErrorCallback:onErrorCallback})
	
	}
	subscribeBars = (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		//console.log('=====subscribeBars runnning')
		
		this.props.subscribeBars({symbolInfo: symbolInfo, resolution: resolution,onRealtimeCallback:onRealtimeCallback,subscribeUID:subscribeUID,onResetCacheNeededCallback:onResetCacheNeededCallback })
	}

	unsubscribeBars = subscriberUID => {
		//console.log('=====unsubscribeBars running')
	}

	calculateHistoryDepth = (resolution, resolutionBack, intervalBack) => {
		//optional
		//console.log('=====calculateHistoryDepth running')
		
		return parseInt(resolution, 10) < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	}

	getMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		//console.log('=====getMarks running')
	} 
	getTimeScaleMarks= (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		//console.log('=====getTimeScaleMarks running')
	} 
	getServerTime= cb => {
		//console.log('=====getServerTime running')
	}




	componentDidMount() {
		const widgetOptions = {
			debug: false,
			symbol: this.props.symbol,
			datafeed: {onReady: this.onReday,searchSymbols: this.searchSymbols,resolveSymbol: this.resolveSymbol,getBars: this.getBars,subscribeBars: this.subscribeBars,unsubscribeBars: this.unsubscribeBars, calculateHistoryDepth: this.calculateHistoryDepth,getMarks: this.getMarks,getTimeScaleMarks: this.getTimeScaleMarks, getServerTime: this.getServerTime   },
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['symbol_info','','shift_visible_range_on_new_bar','header_interval_dialog_button','use_localstorage_for_settings','header_chart_type','header_undo_redo','header_screenshot','header_saveload','header_fullscreen_button','header_settings', 'header_compare', 'header_symbol_search', 'volume_force_overlay','go_to_date'],
			enabled_features: [''],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			toolbar_bg: '#00000000',
			overrides: {
				//"mainSeriesProperties.style": 1,
				"mainSeriesProperties.showCountdown": true,
				"scalesProperties.textColor" : "#AAA", // y축 텍스트
				"mainSeriesProperties.candleStyle.wickUpColor": '#3ab87c', // 촛불 양봉 얇은 선
				"mainSeriesProperties.candleStyle.upColor": "#3ab87c",
				"mainSeriesProperties.candleStyle.wickDownColor": '#df3535', // 촛불 음봉 얇은 선,
				"mainSeriesProperties.candleStyle.downColor": "#df3535",

			},
		};
		this.widget = (window.tvWidget = new window.TradingView.widget(
			widgetOptions
		));

		  this.widget.onChartReady(() => {
            this.chart = this.widget.chart();
			this.chart.createStudy('Moving Average', false, false, [7], null, {"Plot.color":'#ff0000'});
			this.chart.createStudy('Moving Average', false, false, [25], null, {"Plot.color":'#00ff00'});
			this.chart.createStudy('Moving Average', false, false, [99], null, {"Plot.color":'#0000ff'});
        
        });

	}

	componentDidUpdate(prevProps){
		if(prevProps.symbol !== this.props.symbol){
			this.chart.setSymbol(this.props.symbol)
		}
	}



	render() {
		return (
			<div
				id={ this.props.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}

const mapStateToProps = ({chart,trade }) => ({
	history: chart.history,
	pricePrecision: trade.exchangeInfo.pricePrecision
  });



const mapDispatchToProps = dispatch => ({
	subscribeBars: value => dispatch(subscribeBars(value)),
	historyGetBars: value => dispatch(historyGetBars(value))
	});

export default connect(mapStateToProps, mapDispatchToProps)(TVChartContainer)