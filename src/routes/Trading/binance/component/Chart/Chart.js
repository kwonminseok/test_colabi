import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CardBody } from 'reactstrap';
import  TVChartContainer  from './component/TVChartContainer/index';

const Chart = () =>{
  const { t } = useTranslation();
  const {symbol, chartReady }= useSelector(state =>({
    symbol: state.trade.symbol,
    // interval : state.chart.interval,
    chartReady: state.chart.chartReady,
  }))
// <TVChartContainer symbol={symbol} interval={5} />
  return (
    <CardBody className='futureoverfowdl2' style={{padding:"0"}} >
      {chartReady ?
        <></>: <></>
      }
    </CardBody>
  );

}
export default Chart;