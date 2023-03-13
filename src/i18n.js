import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import Cookies from "js-cookie";


function getLang() {
    let a = Cookies.get('Lang') ||'en'
    switch(a){
        case 'ko':{
            return 'ko'
        }
        case 'ja':{
            return 'ja'
        }
        case 'ru':{
            return 'ru'
        }
        case 'cn':{
            return 'cn'
        }

        default: {
            Cookies.set('Lang', 'en',  { expires: 365, path:'/' })
            return 'en'
        }
    }
}


const availableLanguages = ['en','cn','ru','ko','ja'];
const i18nLnag = getLang();

// const options = {
//     order: ['cookie'],
//     lookupCookie: 'Lang',
//     caches: ['cookie'],
//     cookieMinutes: 525600,
//     cookieDomain: 'https://www.bitcolabi.com/'
// }



i18n
  //.use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next) //passes i18n down to react-i18next
  .init({
    //detection: options,
    lng: i18nLnag,
    fallbackLng: 'en',
    debug: false,
    whitelist: availableLanguages,
    //keySeparator: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
        wait: true
      }
  });

export default i18n;
