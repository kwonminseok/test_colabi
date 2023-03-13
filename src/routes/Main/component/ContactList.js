import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import ContactInfo from './ContactInfo';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
function ContactList ({ api, mb }) {

  return (
    <>
      {mb !== 'sm' ? (
        <>
          <div className='mainbody flex-1'>
            <ContactInfo
              name='BTCUSDT'
              num={2}
              symbol={api.btc}
              symbolhl={api.btchl}
            />
          </div>
          <div className='mainbody flex-1'>
            <ContactInfo
              name='ETHUSDT'
              num={2}
              symbol={api.eth}
              symbolhl={api.ethhl}
            />
          </div>
          <div className='mainbody flex-1'>
            <ContactInfo
              name='LINKUSDT'
              num={3}
              symbol={api.link}
              symbolhl={api.linkhl}
            />
          </div>
        </>
      ) : (
        <Carousel
        showThumbs={false}
        >
            <div>
            <ContactInfo
              name='BTCUSDT'
              num={2}
              symbol={api.btc}
              symbolhl={api.btchl}
            />
          </div>
          <div>
            <ContactInfo
              name='ETHUSDT'
              num={2}
              symbol={api.eth}
              symbolhl={api.ethhl}
            />
          </div>
          <div>
            <ContactInfo
              name='LINKUSDT'
              num={3}
              symbol={api.link}
              symbolhl={api.linkhl}
            />
          </div>
        </Carousel>
      )}
    </>
  );
}

export default React.memo(ContactList);
