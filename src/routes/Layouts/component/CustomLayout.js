import React, {useState, useCallback} from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dropdown,
    DropdownToggle,
  } from 'reactstrap';
import { ExtendedDropdown} from '../../../components'
import Toggle from 'react-toggle';
import {RiSettings2Line} from 'react-icons/ri';


const CustomLayout =() => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const layoutlist = useSelector(state => state.user.layoutlist);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const handleToggle = useCallback((what)=> {
      console.log(what)
        dispatch({type: 'user/PUT_LAYOUT', payload: what})
      },[dispatch])
    
      const resetLayout = useCallback(() => {
        dispatch({type: 'user/RESET_LAYOUT'})
        setDropdownOpen(false)
      },[dispatch])


    return(
        <div className='css-a23lsd'>
            <Dropdown
            isOpen={dropdownOpen} toggle={toggle}
              style={{ outline: 'none !important' }}
            >
              <DropdownToggle nav className="hometitilefalse">
                <RiSettings2Line size={23} />
              </DropdownToggle>
              <ExtendedDropdown right className="custom-layout">
              <ExtendedDropdown.Section className="layout-drop">
                {t('customlayout.title')}
              </ExtendedDropdown.Section>
              <ExtendedDropdown.Section>
                <div className="layout-con" style={{display:"flex", flexDirection:"column"}}>
                  <div className="layout-cont-con">
                    <div className="layout-con-title">{t('customlayout.chart')}</div>
                    <div className="layout-con-tog">
                      <div  className="layout-con-tt">
                        <Toggle
                          checked={layoutlist.chart}
                          onChange={() =>handleToggle('chart')}
                          icons={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="layout-cont-con">
                    <div className="layout-con-title">{t('customlayout.orderbook')}</div>
                    <div className="layout-con-tog">
                      <div  className="layout-con-tt">
                        <Toggle
                          checked={layoutlist.orderbook}
                          onChange={() =>handleToggle('orderbook')}
                          icons={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="layout-cont-con">
                    <div className="layout-con-title">{t('customlayout.recents')}</div>
                    <div className="layout-con-tog">
                      <div  className="layout-con-tt">
                        <Toggle
                          checked={layoutlist.recents}
                          onChange={() =>handleToggle('recents')}
                          icons={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="layout-cont-con">
                    <div className="layout-con-title">{t('customlayout.positionOrders')}</div>
                    <div className="layout-con-tog">
                      <div  className="layout-con-tt">
                        <Toggle
                          className="ds"
                          checked={layoutlist.userInfo}
                          onChange={() =>handleToggle('userInfo')}
                          icons={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="reset-layout">
                    <div className="btncho" onClick={resetLayout}>
                    {t('customlayout.reset')}
                    </div>
                  </div>


                </div>
                </ExtendedDropdown.Section>
                </ExtendedDropdown>
              </Dropdown>
              </div>
    )
}
export default CustomLayout;