import React from 'react';
import { BsArrowsAngleContract,BsArrowsAngleExpand } from "react-icons/bs";
function MobHeader ({name,isOpen,handleIsOpen}) {
  return (
    <div className='future-mob-header'>
      <div className='future-mob-title'>{name}</div>
      <div className="mob-title-header">
        {isOpen ? (
          <BsArrowsAngleContract onClick={handleIsOpen} size={15} />
        ) : (
          <BsArrowsAngleExpand onClick={handleIsOpen} size={15} />
        )}
      </div>
    </div>
  );
}

export default React.memo(MobHeader)