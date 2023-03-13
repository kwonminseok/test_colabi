import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  UncontrolledTabs,
  Nav,
} from '../../../../../components';
import {setOptionOnOff} from '../../../../../store/modules/user'
import { CardBody, NavItem, TabPane } from 'reactstrap';
import PriceReach from './component/PriceReach';
import VolumeOption from './component/VolumeOption';
import SuddenMove from './component/SuddenMove';
import { RiCloseFill } from "react-icons/ri";
class Option extends React.Component {


  changeOptionOn = () => {
    this.props.setOptionOnOff();
  }

  render () {
    const {t, toast, user} = this.props;
    console.log(user.optionOn)
    return (
      <>
        {/* <Card style={{ height: '100%', borderRadius: '0' }}> */}
          <UncontrolledTabs initialActiveTabId='price'>
            {/* <CardHeader className='titleheader draggableHandle'>
              <div>알람</div>
              <RiCloseFill className="closebt" size={16} onClick={this.props.onPut}/>
            </CardHeader> */}
            <Nav
              tabs
              className=''
              style={{ borderBottom: '0', padding: '0 0.5rem' }}
            >
              <NavItem style={{ textAlign: 'center' }}>
                <UncontrolledTabs.NavLink tabId='price' className=' ordertab '>
                  {t('alarm.reachprice.title')}
                </UncontrolledTabs.NavLink>
              </NavItem>
              <NavItem style={{ textAlign: 'center' }}>
                <UncontrolledTabs.NavLink tabId='volume' className=' ordertab '>
                {t('alarm.reachvolume.title')}
                </UncontrolledTabs.NavLink>
              </NavItem>
              <NavItem style={{ textAlign: 'center' }}>
                <UncontrolledTabs.NavLink tabId='sudden' className=' ordertab '>
                {t('alarm.soaringplunged.title')}
                </UncontrolledTabs.NavLink>
              </NavItem>
            </Nav>
            <CardBody
              className='flex'
              style={{ padding: '0.5rem', paddingTop: '0' }}
            >
            {this.props.user.userstatus !== 'guest' && this.props.user.userstatus !== 'none'? (
              // this.props.user.userstatus !== 'guest' && this.props.user.userstatus !== 'none' ? (
                  <UncontrolledTabs.TabContent className='positiontab'>
                    <TabPane tabId='price'>
                      <PriceReach toast={toast} />
                    </TabPane>
                    <TabPane tabId='volume'>
                      <VolumeOption toast={toast} />
                    </TabPane>
                    <TabPane tabId='sudden'>
                      <SuddenMove toast={toast} />
                    </TabPane>
                  </UncontrolledTabs.TabContent>
                ) : (
                  <></>
                )
               }
            </CardBody>
          </UncontrolledTabs>
        {/* </Card> */}
      </>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user,
});

const mapDispatchToProps = dispatch => ({
  setOptionOnOff: () => dispatch(setOptionOnOff())
})


export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Option));
