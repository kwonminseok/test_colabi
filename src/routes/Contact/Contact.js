import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';
import Notice from './components/Notice'
import Noticelist from './components/Noticelist';
import Faq from './components/Faq';
import Faqlist from './components/Faqlist'
import Qna from './components/Qna';
import Terms from './components/Terms';
import {getNoticeList,getNoticeContent,getFaqList,getFaqContent} from '../../store/modules/support';
import { userAuthTotal,setMbc } from '../../store/modules/user'
import {setPage } from '../../store/modules/home';
import Footbar from '../component/Footbar';

class Contact extends React.Component {

  constructor(props){
    super(props);
    this.myRef = React.createRef()
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
}
  state = {
    path: '',
    location: '',
  };

  componentDidMount () {
    this.props.setPage('trading')
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this))
    this._setPath(this.props.match.path);
    this.props.userAuthTotal('contact');
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this)) 
  }

  updateWindowDimensions(){
    if(this.props.mbc.check ==='not'){
      if(window.innerWidth>=1280){
        //lg
        this.props.setMbc({check: 'done', mb: 'lg'})
      }else if(window.innerWidth>=768){
        //md
        this.props.setMbc({check: 'done', mb: 'md'})
      }else {
        this.props.setMbc({check: 'done', mb: 'sm'})
        //sm
      }
    }else if(window.innerWidth<768 && this.props.mbc.mb !=='sm'){
      this.props.setMbc({check: 'done', mb: 'sm'})
    }else if(window.innerWidth>=768 &&window.innerWidth<1280 && this.props.mbc.mb !== 'md'){
      this.props.setMbc({check: 'done', mb: 'md'})
    }else if(window.innerWidth>1280 && this.props.mbc.mb !=='lg'){
      this.props.setMbc({check: 'done', mb: 'lg'})
    }
}


  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this._setPath(this.props.match.path);
      window.scrollTo(0,0)
    }
  }

  _setPath = path => {
  
    switch(path){
      case '/support/notice/:id':{
        this.setState({
          path: 'notice',
          location: 'noticelist'
        });
        this.props.getNoticeContent(this.props.match.params.id)
        break;
      }
      case '/support/faq/:id': {
        this.setState({
          path: 'faq',
          location: 'faqlist'
        });
        this.props.getFaqContent(this.props.match.params.id)
        break;
      }
      case '/support/notice':{
        
        this.setState({
          path: 'notice',
          location: 'notice'
        });
        this.props.getNoticeList();
        break;
      }
      // case '/support/guide':{
      //   this.setState({
      //     path: 'guide',
      //     location: 'guide'
      //   });
      //   break;
      // }
      case '/support/qna':{
        this.setState({
          path: 'qna',
          location: 'qna'
        });
        break;
      }
      case '/support/faq':{
        this.setState({
          path: 'faq',
          location: 'faq'
        });
        this.props.getFaqList();
        break;
      }
      case '/support/terms':{
        this.setState({
          path: 'terms',
          location: 'terms'
        });
        break;
      }
      case '/support':{
        document.location.href = '/support/notice';
        break;
      }
      default :{
        document.location.href = '/';
        //404 페이지 ㄱ
        break;
      }
    }

  };

  _listItems = item => {
    const {t} = this.props;
    if (this.state.path === item) {
      return (
        <li key={item} className="contactlist listselected">
          <Link to={'/support/' + item} style={{color:"#153044"}}>{t(`contact.${item}`)}</Link>
        </li>
      );
    } else {
      return (
        <li key={item} className="contactlist">
          <Link to={'/support/' + item}>{t(`contact.${item}`)}</Link>
        </li>
      );
    }
  };

  generateDOM = (location,params) => {
    switch(location){
      case 'notice':{
        return <Notice
        noticelist={this.props.support.noticelist}
        goTop ={this.onClickTop}
        key={location} />
      }
      case 'noticelist':{
        return <Noticelist
            content ={this.props.support.nownoticepage}
            key={location}/>

      }
      case 'faq':{
        return <Faq
        faqlist={this.props.support.faqlist}
        goTop ={this.onClickTop}
        key={location} />
      }
      case 'faqlist':{
        return <Faqlist
            content ={this.props.support.nowfaqpage}
            key={location}/>

      }
      case 'qna':{
        return <Qna
        key={location}/>
      }
      case 'terms':{
        return <Terms
          key={location}
          t={this.props.t}/>
      }
      default:{
        return <></>
      }
    }
  }

  onClickTop = () => {
    let sc = this.myRef.scrollElement || document.getElementById('contactBook')
    sc.scrollTop =0;
    window.scrollTo(0,0)
  }

  render () {
    const list = ['notice', 'faq', 'qna', 'terms'];
    const {location, path} = this.state;
    const {t} = this.props;
    return (
      <>
      <div className='contact-container'>
        <div className="contact-list">
          <div style={{ minHeight: 'auto' }}>
            <div className='list-title'>
             {t('contact.title')}
            </div>
            <div className="contactlist-container">
              <ul className="contact-ul-option">
                {list.map(item => {
                  return this._listItems(item);
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="contact-book" id='contactBook' ref={this.myRef}>
            <div className="contactmain2" >
                <div className="contact-list-header" >
                    <div className="contactmain2-title">{t(`contact.${path}`)}</div>
                </div>
                <div className="contact-list-body">
                    {this.generateDOM(location,this.props.match.params)}
                </div>
            </div>
            <Footbar
            st="foobaroff"/>
        </div>
      </div>
      <Footbar 
      st="foobaron"/>
      </>
    );
  }
}

const mapStateToProps = ({support,user}) => ({
  support: support, 
  mbc: user.mbc,
})

const mapDispatchToProps = dispatch => ({
  userAuthTotal: (value) => dispatch(userAuthTotal(value)),
  getNoticeList: () => dispatch(getNoticeList()),
  getNoticeContent: (id) => dispatch(getNoticeContent(id)),
  getFaqList: () => dispatch(getFaqList()),
  getFaqContent: (id) =>dispatch(getFaqContent(id)),
  setMbc: info => dispatch(setMbc(info)),
  setPage: (value) => dispatch(setPage(value))
})

export default withTranslation()(connect(mapStateToProps,mapDispatchToProps)(Contact));
