import React, {useEffect, useState} from 'react';
import { Table,Tooltip} from 'reactstrap';
import encryption from "../../../../encryption";
import { IoIosArrowForward } from "react-icons/io";

const AccountTable = (props) =>{
  const [width, setWidth] = useState(window.innerWidth)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const {userInfo} = props;
  useEffect(()=>{
    window.addEventListener('resize', updateWindowDimensions)

 
    function updateWindowDimensions(){
      setWidth(window.innerWidth)
    }

    return () =>window.removeEventListener('resize', updateWindowDimensions)

},[])

const setToggle = () =>{
  setTooltipOpen(!tooltipOpen)
}

  const generateApi = (key) => {
    if(key[0] !== ''){
      if(width>1205){
        return  <td className='accmi align-middle bt-0'>
                  {encryption.Decrypt(key[0])}
                </td>
       
      }else if(width<768){
        return  <>
        <td className='accmi align-middle bt-0'  id="api">
          {encryption.Decrypt(key[0]).substring(0,20)}....
        </td>
        <Tooltip placement="auto" isOpen={tooltipOpen} target="api" toggle={setToggle}>{encryption.Decrypt(key[0])}</Tooltip>
        </>
      }else{
        return  <>
        <td className='accmi align-middle bt-0' id="api">
          {encryption.Decrypt(key[0]).substring(0,20)}....
        </td>
        <Tooltip placement="auto" isOpen={tooltipOpen} target="api" toggle={setToggle}>{encryption.Decrypt(key[0])}</Tooltip>
        </>
      } 
    }else {
      return (
        <td className='accmi align-middle bt-0'>
        -
        </td>
      )
    }
    
  }

  return (
    <React.Fragment>
      <div className='table-responsive-xl'>
        <Table className='mb-0'>
          <thead>
            <tr >
              <th style={{borderBottom:"none", width:"25%"}} className='acc text-center align-middle bt-0'>Email</th>
              <th className='accmi align-middle bt-0 account-head'>{userInfo.id}</th>
              <th className='account-link accfi align-middle bt-0'></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='acc text-center align-middle bt-0'>Password</td>
              <td className=' accmi align-middle bt-0'>********</td>
             {width<=768 ? 
              <></> :
                <td className='accfi text-right align-middle bt-0'>
                  <a className='linkcol' href='/password'>
                  Change Password
                  </a>
                </td> 
              }
            </tr>
            <tr>
              <td className='acc text-center align-middle bt-0'>
                NickName
              </td>
              <td className=' accmi align-middle bt-0'>
                {userInfo.nick}
              </td>
              <td className='accfi text-right bt-0'></td>
            </tr>
            <tr>
              <td className='acc text-center align-middle bt-0'>API key</td>
              {generateApi(userInfo.key)}
              {width<=768? 
                <></>:  
                <td className='accfi text-right bt-0 mr-3'>
                  <a className='linkcol' href='/api'>
                    {userInfo.key[0] !=='' ? "Change API key & Secret key": "Register the API"}
                  </a>
                </td>
              }
            </tr>
            <tr>
              <td className='acc text-center align-middle bt-0'>
                Secret key
              </td>
              <td className=' accmi align-middle bt-0'>
               {userInfo.key[0] !=='' ?  '********': "-"}
              </td>
              <td className='accfi text-right bt-0'></td>
            </tr>
          </tbody>
        </Table>
        {width<=768?
        <> 
          <div style={{margin:"0.2rem 0.3rem"}}> 
            <div className="acc account-webkit account-membership"> 
                  <a href='/password'>
                  Change Password
                  </a>
              <div style={{float:"right"}}><IoIosArrowForward size={20}></IoIosArrowForward></div>
            </div>
          </div>
          <div style={{margin:"0.2rem 0.3rem"}}> 
            <div className="acc account-webkit account-membership">
            <a  href='/api'>
              {userInfo.key[0] !=='' ? "Change API key & Secret key": "Register the API"}
              </a>
              <div style={{float:"right"}}><IoIosArrowForward size={20}></IoIosArrowForward></div>
            </div>
          </div>
       </>:<></>}
      </div>
    </React.Fragment>
  );

}
export default AccountTable;