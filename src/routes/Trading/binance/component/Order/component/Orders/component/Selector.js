import React from 'react';
import SwitchSelector from 'react-switch-selector';

  function Selector ({option,handleChange,index,active}) {

    const getIndex = () => {
        return option.findIndex(({ value }) => value === index)
    }


    return (
                <SwitchSelector
                  onChange={handleChange}
                  options={option}
                  forcedSelectedIndex={getIndex()}
                  backgroundColor={'#fff'}
                  fontColor={'#58b589'}
                  wrapperBorderRadius={3}
                  optionBorderRadius={3}
                  fontSize={12}
                  border={'1px solid #58b589'}
                  selectionIndicatorMargin={3}
                />
    )
}

export default React.memo(Selector)