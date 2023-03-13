import React from 'react';
import { connect } from 'react-redux';
import { changeRecentsDepth , setInitialRecentsDepth} from '../../../../../../store/modules/recents';
import TradeReal from './TradeReal';
import SwitchSelector from 'react-switch-selector';

const options = [
  {
    label: 'real',
    value: 'real',
    selectedBackgroundColor: '#e6e8ea',
    fontColor: '#5b5e62',
    selectedFontColor: '#1f2d3d',
  },
  {
    label: '1s',
    value: '1s',
    selectedBackgroundColor: '#e6e8ea',
    fontColor: '#5b5e62',
    selectedFontColor: '#1f2d3d',
  },
  {
    label: '1m',
    value: '1m',
    selectedBackgroundColor: '#e6e8ea',
    fontColor: '#5b5e62',
    selectedFontColor: '#1f2d3d',
  },
];

const initialSelectedIndex = options.findIndex(({value}) => value ==='real');

class Trade extends React.Component {


  componentWillUnmount(){
    this.props.setInitialRecentsDepth()
  }

  getinitialSelectedIndex = () => {
    const {unit} = this.props;
    return options.findIndex(({value}) => value === unit)
  }

  onChange = newValue => {
    this.props.changeRecentsDepth(newValue);
  };

  render () {
   
    return (
      <>
        
         
            <div className='orderbookorder2'>
              <SwitchSelector
                onChange={this.onChange}
                options={options}
                initialSelectedIndex={initialSelectedIndex}
                selectionIndicatorMargin={1}
                backgroundColor={'inherit'}
                fontColor={'#f5f6fa'}
                wrapperBorderRadius={3}
                optionBorderRadius={3}
              />
            </div>
              <div className='flex orderbooktye recent-font' >
                <span className='flex-1 text-left'>Price(USDT)</span>
                <span className='flex-1 text-right'>Size</span>
              <span className='flex-1 text-right'>Time</span>
              </div>
              <div className="recenttradeocnsingle recent-font">
                <TradeReal/>
              </div>
      </>
    );
  }
}

const mapStateToProps = ({ recents}) => ({
  unit: recents.unit,
});

const mapDispatchToProps = dispatch => ({
  changeRecentsDepth: value => dispatch(changeRecentsDepth(value)),
  setInitialRecentsDepth: () => dispatch(setInitialRecentsDepth())
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
