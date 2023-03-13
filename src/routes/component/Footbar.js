import React from 'react'
import { withTranslation } from 'react-i18next';

class Footbar extends React.Component{

    render(){
      const {t} = this.props;
        return(
            <div className={'bc-footbar '+this.props.st}>
                  <div className="footermanu">
                    <ul>
                      <li className="listyle">{t('contact.terms')}</li>
                      <li  className="listyle">{t('contact.title')}</li>
                    </ul>
                  </div>
                  <span style={{height:"60px", lineHeight:"60px"}}>
                  © 2018 - 2020 Bitcolabi.com. All rights reserved
                  </span>
            </div>
        )
    }
}

export default withTranslation()(Footbar);