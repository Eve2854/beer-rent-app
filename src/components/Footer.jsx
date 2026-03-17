import React from 'react';
import { Instagram, Facebook, Code, Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-content">
        <div className="footer-socials">
          <p className="social-title">Seguinos en nuestras redes</p>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/mondcervezaartesanalbalcarce/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Instagram size={24} /> <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/p/Mond-Cerveza-Artesanal-100089634233421/?locale=ca_ES"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Facebook size={24} /> <span>Facebook</span>
            </a>
            <a
              href="https://wa.me/2235599863"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <MessageCircle size={24} /> <span>WhatsApp</span>
            </a>
          </div>
          <div className="footer-copy">(c) MOND Cerveza Artesanal 2026</div>
          <div className="terms-links">
            <a href="/privacidad.html">Política de privacidad</a>
            <span>•</span>
            <a href="/terminos.html">Términos completos</a>
          </div>
        </div>
        <hr className="footer-divider" />

        <div className="footer-credits">
          <div className="dev-info">
            <Code size={16} className="dev-icon" />
            <span>Desarrollado por: <b>Evelyn Sepulveda</b></span>
          </div>
          <div className="dev-info">
            <Phone size={16} className="dev-icon" />
            <span>Telefono: <a href="tel:2266530777" className="dev-link">2266530777</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

