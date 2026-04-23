import React from 'react';
import { LOGO_URL } from '../constants/appConstants';

const Header = () => {
  return (
    <header className="header-pro-slim">
      <div className="header-limit">
        <div className="header-content-slim">
          <img 
            src={LOGO_URL} 
            alt="Mond Cerveza Artesanal" 
            className="logo-img-solo" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
