import React from 'react';
import { motion } from 'framer-motion';

const Header = () => (
  <header className="header-pro-slim">
    <div className="header-limit">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="header-content-slim">
        <img src="/logo.png" alt="Logo" className="logo-img-slim" />
        <h1 className="logo-text-slim">Beer Rent</h1>
      </motion.div>
    </div>
  </header>
);

export default Header;