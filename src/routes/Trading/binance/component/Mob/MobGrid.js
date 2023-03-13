import React from 'react';
import SubTitle from './component/SubTitle/SubTitle';
import MinCon from './component/MinCon/MinCon';
import Mob from './component/Mob';
import MoMargin from './component/MoMargin';
import MoOrder from './component/MoOrder/MoOrder'
class MobGrid extends React.PureComponent{


    render(){
        return(
            <div className="futuregridlayout-log">
                <div className="futuregrid-test1" >
                    <SubTitle/>
                </div>
                <div className='futuregrid-test2'>
                    <MinCon/>
                </div>
                <div className="futuregrid-test5">
                    <MoOrder/>
                </div>
                <div className='futuregrid-test3'>
                    <Mob/>
                </div>
                <div className="futuregrid-test4">
                    <MoMargin/>
                </div>
            </div>
        )
    }
}
export default MobGrid;