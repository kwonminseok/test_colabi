import React from 'react';


function Notvalid ({usetstatus,t}){

  const goLogin = () => {
    document.location.href ='/mypage/account'
  }

  return(
      <div className="bitbtnbox">
        <div
          onClick={goLogin}
          className='btn-box'
        >
        {t('account.mypage')}
        </div>
      </div>
  )
}

export default React.memo(Notvalid);