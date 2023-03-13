import React from 'react';
import { IoMdCloseCircleOutline ,IoMdCheckmarkCircleOutline,IoMdFlashlight} from "react-icons/io";
export const contentInfo = message => { //v
  return (
    <div style={{color:"rgb(13 155 17)", display:"flex", alignItems:"center"}}>
      <IoMdCheckmarkCircleOutline size={22}/>
      <span style={{ color: '#000', paddingLeft: '10px', fontSize:"16px" }}>{message}</span>
    </div>
  );
};

export const contentInfo2 = message => { //v
  return (
    <div style={{color:"rgb(13 155 17)", display:"flex", alignItems:"center"}}>
      <IoMdCheckmarkCircleOutline size={18}/>
      <span style={{ color: '#000', paddingLeft: '10px', fontSize:"14px" }}>{message}</span>
    </div>
  );
};

export const contentError = (title,message) => ( //x
  <>
  <div style={{color:"rgb(216 17 17)",display:"flex", alignItems:"center"}}>
    <IoMdCloseCircleOutline size={22}/>
    <span style={{ color: '#000', paddingLeft: '10px', fontSize:"16px" }}>{title}</span>
  </div>
  <div style={{color:"#333",fontSize:"13px", paddingLeft:"32px"}}>{message}</div>
  </>
);

export const contentWarning = (message) => ( //!
  
  <div style={{color:"#153044",display:"flex", alignItems:"center"}}>
    <IoMdFlashlight size={18}/>
    <span style={{ color: '#000', paddingLeft: '10px' }}>{message}</span>
  </div>
  
);

export const contentErrornoTitle = (message) => ( //!
  <div style={{color:"rgb(216 17 17)",display:"flex", alignItems:"center"}}>
    <IoMdCloseCircleOutline size={18}/>
    <span style={{ color: '#000', paddingLeft: '10px' }}>{message}</span>
  </div>
);

