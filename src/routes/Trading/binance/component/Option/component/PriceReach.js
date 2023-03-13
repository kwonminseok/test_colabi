import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  AiFillPlusCircle,
  AiOutlineCheckSquare,
  AiOutlineCloseSquare,
} from 'react-icons/ai';
import SwitchSelector from 'react-switch-selector';
import {
  addPriceAlarm,
  cancelPriceAlarm,
  adjustOptionData,
} from '../../../../../../store/modules/option';
import _ from 'lodash';
import {
  contentInfo,
  contentWarning,
  contentError,
} from '../../../../../../components/Notification/Notification';
const options = [
  {
    label: 'once',
    value: 'once',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: 'every T',
    value: 'always',
    selectedBackgroundColor: '#58b589',
  },
];

const initialSelectedIndex = options.findIndex(({ value }) => value === 'once');

class PriceReach extends React.Component {
  constructor (props) {
    super(props);

    this.priceInput = React.createRef();
  }

  state = {
    addNew: false,
    price: '',
    option: 'once',
  };


  componentDidUpdate (prevProps,prevState) {
    if (!prevState.addNew && this.state.addNew) {
      this.priceInput.current.focus();
    }
    if(prevProps.trade60 !== this.props.trade60 && this.props.trade60.length && this.props.option.length){
      const price=[];
      let option = this.props.option;
      _.forEach(this.props.option, item => {
        if(this.props.trade60[0].l<=item.price && this.props.trade60[0].h>=item.price){
          //가격도달 알람주고
          this.props.toast.success(contentInfo(item.price+"도달"));
          if(item.option ==="once"){
            //제거
            price.unshift(item.price)
            option = _.filter(option, item2 => item2.price !== item.price)

          }
        }
      })
      if(price.length){
        this.props.cancelPriceAlarm(option);
        this.props.adjustOptionData();
      }
    }
  }

  handleChangeOption = newValue => {
    this.setState({
      option: newValue,
    });
  };

  handlePriceChange = e => {
    const re = /^[0-9\b]+$/;
    var check = e.target.value;
    const check2 = check.split('.');
    var check3 = false;
    if (check2[1] !== undefined) {
      if (check2[1].length > 2) {
        check = Math.floor(check * 100) / 100;
      }
      check3 = true;
    } else {
      check3 = true;
    }

    if (check3 && (check * 100 === '' || re.test(check * 100))) {
      this.setState({
        price: check,
      });
    }
  };

  handelClickRegister = () => {
    const { price } = this.state;
    if (price > 0) {
      const num = _.findIndex(this.props.option, function (o) {
        return o.price === price;
      });
      if (num === -1) {
        this.props.addPriceAlarm({
          new: {
            symbol: this.props.symbol,
            price: this.state.price,
            option: this.state.option,
            status: 'new',
          },
        });
        this.handleClickClose();
        this.props.adjustOptionData();
        this.props.toast.success(contentInfo('가격 도달 알람 등록 '));
      } else {
        //alert 띄우기 이미 있는 price
      }
    }
  };

  handleClickClose = () => {
    this.setState({
      price: '',
      option: 'once',
      addNew: false,
    });
  };

  handleClickCancel = price => {
    const pricer = this.props.option.filter(item => item.price !== price);
    this.props.cancelPriceAlarm(pricer);
    this.props.adjustOptionData();
    this.props.toast.warning(contentWarning('가격 도달 알람 취소'));
  };

  addNewPrice = () => {
    return (
      <div className='flex positionorderlist'>
        <div className='headtype01'></div>
        <div className='headtype33'>
          <input
            type='text'
            className='optionprice'
            value={this.state.price}
            onChange={this.handlePriceChange}
            ref={this.priceInput}
          />
        </div>
        <div className='headtype04'></div>
        <div
          className='headtype33'
          style={{ overflow: 'hidden', textAlign: 'center' }}
        >
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
        <div className='headtype22' style={{ textAlign: 'center' }}>
          <AiOutlineCheckSquare
            type='button'
            className='addnew'
            size={24}
            onClick={this.handelClickRegister}
          />
          <AiOutlineCloseSquare
            type='button'
            className='cancelnew'
            size={24}
            onClick={this.handleClickClose}
          />
        </div>
      </div>
    );
  };

  generateDOM () {
    const {t} = this.props;
    return _.map(this.props.option, item => {
      if (item.symbol === this.props.symbol && this.props.aggtrade.length) {
        const bet = parseFloat(this.props.aggtrade[0].p - item.price).toFixed(
          2,
        );
        return (
          <div className='flex positionorderlist' key={item.price}>
            <div className='headtype01'>{item.symbol}</div>
            <div className='headtype33'>{item.price}</div>
            <div className='headtype04'>
              {this.props.aggtrade[0].p}
              {bet > 0 ? (
                <span className='tradebuy'>(+{bet})</span>
              ) : (
                <span className='tradesell'>({bet})</span>
              )}
            </div>
            <div className='headtype33 textwebcent'>
              <div className='he24we60'>{item.option}</div>
            </div>
            <div className='headtype22' style={{ textAlign: 'center' }}>
              <span
                className='actionclick'
                type='button'
                onClick={() => this.handleClickCancel(item.price)}
              >
                {t('order.leverage.cancel')}
              </span>
            </div>
          </div>
        );
      }
    });
  }

  addNew = () => {
    this.setState({
      addNew: !this.state.addNew,
    });
  };

  render () {
    const { aggtrade, t } = this.props;
    return (
      <>
        <div className='position-header'>
          <div className='headtype01 '>{t('alarm.symbol')}</div>
          <div className='headtype33'>{t('alarm.reachprice.price')}</div>
          <div className='headtype04'>{t('alarm.reachprice.markprice')}</div>
          <div className='headtype33' style={{ textAlign: 'center' }}>
          {t('alarm.reachprice.option.title')}
          </div>
          <div className='headtype22' style={{ textAlign: 'center' }}>
          {t('alarm.action')}
          </div>
        </div>
        <div className='position-content' style={{ display: 'block' }}>
          {this.state.addNew ? this.addNewPrice() : <></>}
          {this.generateDOM()}
        </div>
        {this.props.option.length < 3 ? (
          <AiFillPlusCircle
            className='addnew'
            type='button'
            onClick={this.addNew}
            size={30}
            style={{ position: 'absolute', bottom: '30px', right: '20px' }}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ option, websocket }) => ({
  option: option.priceReach,
  aggtrade: websocket.aggtradeOrderbook,
  symbol: websocket.symbol,
  trade60: websocket.trade60,
});

const mapDispatchToProps = dispatch => ({
  addPriceAlarm: value => dispatch(addPriceAlarm(value)),
  cancelPriceAlarm: value => dispatch(cancelPriceAlarm(value)),
  adjustOptionData: () => dispatch(adjustOptionData()),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PriceReach));
