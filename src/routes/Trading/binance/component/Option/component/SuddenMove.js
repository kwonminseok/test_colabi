import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import SwitchSelector from 'react-switch-selector';
import {
  addSuddenMoveAlarm,
  cancelSuddenMoveAlarm,
  adjustOptionData,
} from '../../../../../../store/modules/option';
import {
  contentInfo,
  contentWarning,
  contentError,
} from '../../../../../../components/Notification/Notification';
const options2 = [
  {
    label: 'All',
    value: 'all',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: 'Up',
    value: 'up',
    selectedBackgroundColor: '#58b589',
  },
  {
    label: 'Down',
    value: 'down',
    selectedBackgroundColor: '#58b589',
  },
];

const initialSelectedIndex2 = options2.findIndex(
  ({ value }) => value === 'all',
);

let prevUp = 0;
let prevDown = 0;
class SuddenMove extends React.Component {
  state = {
    seconds: 1,
    price: '',
    option2: 'all',
  };

  componentDidUpdate (prevProps, prevState) {
    if (this.props.sudden.length && prevProps.trade60 !== this.props.trade60) {
      const second = this.props.sudden[0].seconds;
      const base = this.props.sudden[0].price;
      if (this.props.trade60.length >= second) {
        const gap = parseFloat(this.props.trade60[0].c - this.props.trade60[second - 1].o).toFixed(2);
        switch (this.props.sudden[0].option) {
          case 'all': {
            if (this.checkUp(gap, base)) {
              //급등 알람
              this.props.toast.success(contentInfo(gap + 'USDT 급등'));
            } else if (this.checkDown(gap, -1 * base)) {
              //급락 알람
              this.props.toast.success(contentInfo(-1 * gap + 'USDT 급락'));
            }
            break;
          }
          case 'up': {
            if (this.checkUp(gap, base)) {
              this.props.toast.success(contentInfo(gap + 'USDT 급등'));
              //급등알람
            }
            break;
          }
          case 'down': {
            if (this.checkDown(gap, -1 * base)) {
              this.props.toast.success(contentInfo(-1 * gap + 'USDT 급락'));
              //급락알람
            }
            break;
          }
        }
      }
    }
  }

  checkUp = (gap, base) => {
    if (gap >= base) {
      if (prevUp !== 1) {
        prevUp = 1;
        prevDown = 0;
        return true;
      } else {
        return false;
      }
    } else {
      prevUp = 0;
      return false;
    }
  };

  checkDown = (gap, base) => {
    if (gap <= base) {
      if (prevDown !== 1) {
        prevDown = 1;
        prevUp = 0;
        return true;
      } else {
        return false;
      }
    } else {
      prevDown = 0;
      return false;
    }
  };

  handelClickRegister = () => {
    if (this.state.price > 0) {
      this.props.addSuddenMoveAlarm({
        new: {
          symbol: this.props.symbol,
          seconds: this.state.seconds,
          price: this.state.price,
          option: this.state.option2,
        },
      });
      this.handleClickClose();
      this.props.adjustOptionData();
      this.props.toast.success(contentInfo('급등 급락 알람 등록 '));
    }
  };

  handleChangeOption2 = newValue => {
    this.setState({
      option2: newValue,
    });
  };

  handleClickClose = () => {
    this.setState({
      seconds: 1,
      price: '',
    });
  };

  handleClickCancel = () => {
    this.props.cancelSuddenMoveAlarm();
    this.props.adjustOptionData();
    this.props.toast.warning(contentWarning('급등 급락 알람 취소'));
  };

  handleSecondsChange = e => {
    this.setState({
      seconds: e.target.value,
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

  generateDOM () {
    const {t} = this.props;
    if (this.props.sudden.length) {
      return _.map(this.props.sudden, item => {
        if (item.symbol === this.props.symbol) {
          return (
            <div className='flex positionorderlist' key={item.symbol}>
              <div className='headtype01'>{item.symbol}</div>
              <div className='headtype33'>{item.price}</div>
              <div className='headtype33 textwebcent'>
                <div className='he24we60'>{item.seconds}</div>
              </div>
              <div className='headtype33 textwebcent'>
                <div className='he24we60'>{item.option}</div>
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
              value={this.state.price}
              onChange={this.handlePriceChange}
            />
          </div>
          <div
            className='headtype33'
            style={{ overflow: 'visible', textAlign: 'center' }}
          >
            <UncontrolledButtonDropdown>
              <DropdownToggle caret className='pb-0 pt-0 secondbuton'>
                {this.state.seconds}s
              </DropdownToggle>
              <DropdownMenu className='orderbookdropdown'>
                <DropdownItem
                  onClick={() =>
                    this.setState({
                      seconds: 1,
                    })
                  }
                >
                  1s
                </DropdownItem>
                <DropdownItem
                  onClick={() =>
                    this.setState({
                      seconds: 3,
                    })
                  }
                >
                  3s
                </DropdownItem>
                <DropdownItem
                  onClick={() =>
                    this.setState({
                      seconds: 5,
                    })
                  }
                >
                  5s
                </DropdownItem>
                <DropdownItem
                  onClick={() =>
                    this.setState({
                      seconds: 10,
                    })
                  }
                >
                  10s
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
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
          <div className='headtype33'>{t('alarm.soaringplunged.pricechange')}</div>
          <div className='headtype33' style={{ textAlign: 'center' }}>
          {t('alarm.soaringplunged.time')}
          </div>
          <div className='headtype33' style={{ textAlign: 'center' }}>
          {t('alarm.soaringplunged.option.title')}
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
  sudden: option.suddenmove,
  symbol: websocket.symbol,
  trade60: websocket.trade60,
});

const mapDispatchToProps = dispatch => ({
  addSuddenMoveAlarm: value => dispatch(addSuddenMoveAlarm(value)),
  cancelSuddenMoveAlarm: () => dispatch(cancelSuddenMoveAlarm()),
  adjustOptionData: () => dispatch(adjustOptionData()),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SuddenMove));
