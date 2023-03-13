import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import {
  addVolumeAlarm,
  cancelVolumeAlarm,
  adjustOptionData,
} from '../../../../../../store/modules/option';
import SwitchSelector from 'react-switch-selector';
import _ from 'lodash';
import {
  contentInfo,
  contentWarning,
  contentError,
} from '../../../../../../components/Notification/Notification';
const options = [
  {
    label: '1s',
    value: '1s',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: '1m',
    value: '1m',
    selectedBackgroundColor: '#58b589',
  },
];

const options2 = [
  {
    label: 'All',
    value: 'all',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: 'Buy',
    value: 'buy',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: 'Sell',
    value: 'sell',
    selectedBackgroundColor: '#58b589',
  },
];

const initialSelectedIndex = options.findIndex(({ value }) => value === '1s');
const initialSelectedIndex2 = options2.findIndex(
  ({ value }) => value === 'all',
);

class VolumeOption extends React.Component {
  state = {
    volume: '',
    option: '1s',
    option2: 'all',
  };

  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.option.length &&
      prevProps.unitvolumeAlert !== this.props.unitvolumeAlert
    ) {
      const a = this.props.option[0];
      switch (a.option2) {
        case 'all': {
          if(this.props.unitvolumeAlert[0].all>a.volume){
            //거래량 알람
            this.props.toast.success(contentInfo("전체 거래량 "+a.volume+" 도달"));
          }
          break;
        }
        case 'buy': {
          if(this.props.unitvolumeAlert[0].buy>a.volume){
            this.props.toast.success(contentInfo("매수 거래량 " +a.volume+" 도달"));
            //알람
          }
          break;
        }
        case 'sell':{
          if(this.props.unitvolumeAlert[0].sell>a.volume){
            this.props.toast.success(contentInfo("매도 거래량 "+a.volume+" 도달"));
            //알람
            
          }
          break;
        }
      }
    }
  }

  handleVolumeChange = e => {
    const re = /^[0-9\b]+$/;
    var check = e.target.value;
    const check2 = check.split('.');
    var check3 = false;
    if (check2[1] !== undefined) {
      if (check2[1].length > 3) {
        check = Math.floor(check * 1000) / 1000;
      }
      check3 = true;
    } else {
      check3 = true;
    }
    if (check3 && (check * 1000 === '' || re.test(check * 1000))) {
      this.setState({
        volume: check,
      });
    }
  };

  handleChangeOption = newValue => {
    this.setState({
      option: newValue,
    });
  };

  handleChangeOption2 = newValue => {
    this.setState({
      option2: newValue,
    });
  };

  handelClickRegister = () => {
    if (this.state.volume > 0) {
      this.props.addVolumeAlarm({
        new: {
          symbol: this.props.symbol,
          volume: this.state.volume,
          option1: this.state.option,
          option2: this.state.option2,
          status: 'new',
        },
      });
      this.handleClickClose();
      this.props.adjustOptionData();
      this.props.toast.success(contentInfo('거래량 도달 알람 등록 '));
    }
  };

  handleClickClose = () => {
    this.setState({
      volume: '',
      option: '1s',
      option2: 'all',
    });
  };

  handleClickCancel = () => {
    this.props.cancelVolumeAlarm();
    this.props.adjustOptionData();
    this.props.toast.warning(contentWarning('거래량 도달 알람 취소'));
  };

  generateDOM () {
    const {t} = this.props;
    if (this.props.option.length) {
      return _.map(this.props.option, item => {
        if (item.symbol === this.props.symbol) {
          return (
            <div className='flex positionorderlist' key={item.volume}>
              <div className='headtype01'>{item.symbol}</div>
              <div className='headtype33'>{item.volume}</div>
              <div className='headtype33 textwebcent'>
                <div className='he24we60'>{item.option1}</div>
              </div>
              <div className='headtype33 textwebcent'>
                <div className='he24we60'>{item.option2}</div>
              </div>
              <div className='headtype22' style={{ textAlign: 'center' }}>
                <span
                  className='actionclick'
                  type='button'
                  onClick={this.handleClickCancel}
                >
                  {t('order.leverage.cancel')}
                </span>
              </div>
            </div>
          );
        }
      });
    } else {
      return (
        <div className='flex positionorderlist'>
          <div className='headtype01'></div>
          <div className='headtype33'>
            <input
              type='text'
              className='optionprice'
              value={this.state.volume}
              onChange={this.handleVolumeChange}
            />
          </div>
          <div className='headtype33' style={{ overflow: 'hidden' }}>
            <SwitchSelector
              onChange={this.handleChangeOption}
              options={options}
              initialSelectedIndex={initialSelectedIndex}
              backgroundColor={'#fff'}
              fontColor={'#58b589'}
              wrapperBorderRadius={3}
              optionBorderRadius={3}
              border={'1px solid #58b589'}
              selectionIndicatorMargin={3}
            />
          </div>
          <div className='headtype33' style={{ overflow: 'hidden' }}>
            <SwitchSelector
              onChange={this.handleChangeOption2}
              options={options2}
              initialSelectedIndex={initialSelectedIndex2}
              backgroundColor={'#fff'}
              fontColor={'#58b589'}
              fontSize={11}
              wrapperBorderRadius={3}
              optionBorderRadius={3}
              border={'1px solid #58b589'}
              selectionIndicatorMargin={3}
            />
          </div>
          <div className='headtype22' style={{ textAlign: 'center' }}>
            <AiOutlineCheckSquare
              type='button'
              className='addnew'
              size={24}
              onClick={this.handelClickRegister}
            />
          </div>
        </div>
      );
    }
  }

  render () {
    const {t} = this.props;
    return (
      <>
        <div className='position-header'>
    <div className='headtype01'>{t('alarm.symbol')}</div>
          <div className='headtype33'>{t('alarm.reachvolume.volume')}</div>
          <div className='headtype33' style={{ textAlign: 'center' }}>
          {t('alarm.reachvolume.timebasis')}
          </div>
          <div className='headtype33' style={{ textAlign: 'center' }}>
          {t('alarm.reachvolume.volumebasis.title')}
          </div>
          <div className='headtype22' style={{ textAlign: 'center' }}>
          {t('alarm.action')}
          </div>
        </div>
        <div className='position-content' style={{ display: 'block' }}>
          {this.generateDOM()}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ option, websocket }) => ({
  option: option.unitvolume,
  unitvolumeAlert: websocket.unitvolumeAlert,
  symbol: websocket.symbol,
});

const mapDispatchToProps = dispatch => ({
  addVolumeAlarm: value => dispatch(addVolumeAlarm(value)),
  cancelVolumeAlarm: () => dispatch(cancelVolumeAlarm()),
  adjustOptionData: () => dispatch(adjustOptionData()),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(VolumeOption));
