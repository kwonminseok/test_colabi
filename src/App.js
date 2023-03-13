/* eslint-disable no-undef */
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-dropdown/style.css';
import { withCookies } from 'react-cookie';
import AppLayout from './layout/default';
import { RoutedContent } from './routes';
import SyncLoader from "react-spinners/SyncLoader";
const basePath = process.env.BASE_PATH || '/';

class App extends React.Component {
  
  render () {
    return (
      <Router basename={basePath}>
        <Suspense fallback={<div className="flex" style={{height:"100vh"}}><div className='flex-1 reserve'><SyncLoader size={10}color="#58b589"margin="2px" /></div></div>}>
          <AppLayout>
            <RoutedContent />
          </AppLayout>
        </Suspense>
      </Router>
    );
  }
}



export default withCookies(App);
