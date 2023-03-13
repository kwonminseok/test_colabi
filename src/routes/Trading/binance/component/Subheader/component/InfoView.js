import React from 'react'

function InfoView({name,data}) {
    
    return(
        <div className="future-funding">
                      <div className="ttt">
                        <div className="future-fundingtime">{name}</div>
                      </div>
                      <div className="con">
                      <div className="future-con-fee">{parseFloat(data).toLocaleString()}</div>
                      </div>
                    </div>
    )
}
export default React.memo(InfoView)