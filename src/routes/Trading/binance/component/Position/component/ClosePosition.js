import React, {useState, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux';



function ClosePosition({position}){
    const [price, setPrice] = useState(parseFloat(position.markPrice).toFixed(position.pricePrecision))
    const maxlength = useSelector(state => state.trade.maxlength)
    const dispatch = useDispatch();


    const checkSubPrice = useCallback((value) => {
        const firstre = /^[0-9\b]+$/
        const check3 = value.split('.');
        if(value.length === 0){
          return value
        }else if(check3.length ===1){
          if(firstre.test(check3[0]) &&check3[0].length<=maxlength){
            return parseInt(check3[0]).toString()//this.props.setPrice(value)        
          }
        }else if(check3.length ===2){
          let a =0;
            if(check3[0].length<=maxlength && (firstre.test(check3[0]) || check3[0] === '')){
              if(firstre.test(check3[0])){
                a = parseFloat(check3[0]);
              }
              if(firstre.test(check3[1]) || check3[1] === ''){
                if(check3[1].length>position.pricePrecision){
                  return a+'.'+check3[1].slice(0,position.pricePrecision)//this.props.setPrice(a+'.'+check3[1].slice(0,exchangeInfo.pricePrecision))
                }else{
                  return a+'.'+check3[1]//this.props.setPrice(a+'.'+check3[1])
                }
              }
            }
        }else return 'no';
    },[position,maxlength])

    const handlePriceChange = useCallback((e)=> {
        const a = checkSubPrice(e.target.value)
        if(a !=='no' && a!== undefined){
            setPrice(a);
        }
    },[checkSubPrice,dispatch])


    const closeMarket = () => {
        if(parseFloat(position.positionAmt)>0){
            dispatch({
                type:"api/SUMMIT_ORDER",
                payload:{
                    type: 'Limit',
                    isMarket: true,
                    symbol: position.symbol,
                    side: 'sell',
                    isReduce: true,
                    amount: Math.abs(position.positionAmt)
                }
            })
        }else{
            dispatch({
                type:"api/SUMMIT_ORDER",
                payload:{
                    type: 'Limit',
                    isMarket: true,
                    symbol: position.symbol,
                    side: 'buy',
                    isReduce: true,
                    amount: Math.abs(position.positionAmt)
                }
            })
        }
    }

    const closeLimit = () => {
        if(price.length!==0){
            if(parseFloat(position.positionAmt)>0){
                dispatch({
                    type:"api/SUMMIT_ORDER",
                    payload:{
                        type: 'Limit',
                        isMarket: false,
                        price: price,
                        symbol: position.symbol,
                        side: 'sell',
                        isReduce: true,
                        amount: Math.abs(position.positionAmt)
                    }
                })
            }else{
                dispatch({
                    type:"api/SUMMIT_ORDER",
                    payload:{
                        type: 'Limit',
                        isMarket: false,
                        price: price,
                        symbol: position.symbol,
                        side: 'buy',
                        isReduce: true,
                        amount: Math.abs(position.positionAmt)
                    }
                })
            }
        }
    }


    return(
        <div className='positionclose'>
                <button onClick={closeMarket} className="positionbutton">
                    Market
                </button>
                <button onClick={closeLimit} className="positionbutton">
                    Limit
                </button>
                <div className='positionorderinput'>
                    <input
                    type="text"
                    className="inputorposition"
                    value={price}
                    onChange={(e)=> handlePriceChange(e)}
                    />
                </div>
          </div>
    )

}
export default React.memo(ClosePosition);
