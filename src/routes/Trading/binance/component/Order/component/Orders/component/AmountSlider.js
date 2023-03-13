import React from 'react';
import Slider from 'rc-slider';

const marks = {
    0: '',
    20: '',
    40: '',
    60: '',
    80: '',
    100: '',
  };

function AmountSlider({handlePercent,value}){

    return(
        <div className='orderbookorder' style={{ paddingBottom: '20px', margin:"5px 7px" }}>
              <Slider
                style={{ paddingTop: '20px' }}
                marks={marks}
                step={1}
                value={value}
                defaultValue={0}
                onChange={handlePercent}
                trackStyle={{ backgroundColor: '#b3bdc9' }}
                railStyle={{ backgroundColor: '#eaecef' }}
                dotStyle={{
                  backgroundColor: '#eaecef',
                  border: '1px solid',
                  borderColor: '#fff',
                }}
                handleStyle={{ border: '2px solid #b3bdc9', boxShadow: 'none' }}
                activeDotStyle={{
                  backgroundColor: '#b3bdc9',
                  borderColor: '#fff',
                }}
              />
        </div>
    )
}

export default React.memo(AmountSlider)