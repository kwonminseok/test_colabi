import React from 'react';

function Notlog ({usetstatus,t}){

  const goLogin = () => {
    document.location.href = '/login'
  }

  const goRegister = () => {
    document.location.href = '/register'
  }

  return(
    <div style={{marginTop:"0.5rem"}}>
    <div className="bitbtnbox">
      <div
        onClick={goLogin}
        className='btn-box'
      >
        {t('login.title')}
      </div>
    </div>
    <div className="colabibox">
      <div
        onClick={goRegister}
        className='btn-box'
      >
        {t('register.title')}
      </div>
    </div>
  </div>
  )
}

export default React.memo(Notlog);