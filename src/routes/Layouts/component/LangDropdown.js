import React from 'react'
import Dropdown from 'react-dropdown';
import Cookies from 'js-cookie';


const LNAG_LIST = [{ value: 'en', label: 'English',className: 'lang-drop-option' },
{ value: 'cn', label: '中文',className: 'lang-drop-option' },
{ value: 'ru', label: 'Русский',className: 'lang-drop-option' },
{ value: 'ko', label: '한국어',className: 'lang-drop-option' },
{ value: 'ja', label: '日本語',className: 'lang-drop-option' }]

function LangDropdown({t}){

    const setLang = lang => {
        Cookies.set('Lang', lang, { expires: 365, path: '/' });
        window.location.reload();
      };


    return(
        <Dropdown 
            arrowClassName='lang-drop-arrow'
            controlClassName="lang-drop-control"
            className='lang-drop-root'
            placeholderClassName='lang-drop-place'
            menuClassName='lang-drop-menu'
            options={LNAG_LIST}
            value ={t('lang')}
            onChange={value => setLang(value.value)}
    />
)
}


export default React.memo(LangDropdown);