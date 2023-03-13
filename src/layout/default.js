import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import { ThemeProvider } from '../components/Theme';
import { RoutedNavbars } from '../routes';
import { withTranslation } from 'react-i18next';
import './../styles/bootstrap.scss';
import './../styles/main.scss';
import './../styles/plugins/plugins.scss';
import './../styles/plugins/plugins.css';

class AppLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
 
  onClickGoNotice = () =>{ 
    document.location.href = '/support/notice';
  }
  onClickGoTerms = () =>{ 
    document.location.href = '/support/terms';
  }

  render () {
    const { children, page,t } = this.props;
    return (
      <ThemeProvider initialStyle='light' initialColor='primary'>
        <Layout>
          {/* --------- Navbar ----------- */}
          <Layout.Navbar >
            <RoutedNavbars />
          </Layout.Navbar>
          
          {/* -------- Content ------------*/}
          <Layout.Content>{children}
          {page ===""?
          
          <div className="bc-footbar">
            <div className="footermanu">
              <ul>
                <li className="listyle" onClick={this.onClickGoTerms}>{t('contact.terms')}</li>
                <li  className="listyle" onClick={this.onClickGoNotice}>{t('contact.title')}</li>
              </ul>
            </div>
            <span style={{height:"60px", lineHeight:"60px"}}>
            © 2019 - 2021 Bitcolabi.com. All rights reserved
            </span>
          </div>
          :<></>}
          </Layout.Content>
         
        </Layout>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ home }) => ({
  page: home.page,
});

export default withTranslation()(connect(mapStateToProps, undefined)(AppLayout));
