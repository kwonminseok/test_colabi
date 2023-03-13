import React, {useRef,useEffect, useState} from 'react'
import LinkBox from './LinkBox'
import _ from 'lodash'
function LinkScroll({activeData,symbol}){
    const [slideLeft, setSlideLeft] = useState(0);
    const [slideRight, setSlideRight] = useState(false);
    const navRef = useRef(window.pageYOffset)
    
    useEffect(() =>{
        if(navRef.current !== undefined){
            if(navRef.current.scrollLeft !== slideLeft){
                setSlideLeft(navRef.current.scrollLeft)
            }
            if(navRef.current.scrollLeft+navRef.current.offsetWidth<navRef.current.scrollWidth){
                setSlideRight(true)
            }else{
                setSlideRight(false)
            }
           
        }
    },[navRef.current.scrollLeft, navRef.current.scrollWidth, navRef.current.offsetWidth])


    const handleScroll = (direction) =>{
        if(direction ==='left'){
            navRef.current.scrollLeft -=200;
        }else{
            navRef.current.scrollLeft +=200;
        }
    }

    const genenrateDOM = () =>{
        return _.map(activeData, item =>{
            return (
                <LinkBox
                    symbolObject={item}
                    symbol={symbol}
                    key={item.symbol}
                />
            )
        })
    }


    return(
        <div className="future-sclk6" >
            {slideLeft>0?
            <div className="futures-scrollleft" onClick={()=> handleScroll('left')}></div>
            :
            <></>}
            <div className="future-symbollist" ref={navRef} >
                {genenrateDOM()}
            </div>
            {slideRight?
                <div className="futures-scrollright" onClick={()=> handleScroll('right')}></div>
                :
                <></>}
        </div>
    )

}

export default React.memo(LinkScroll)