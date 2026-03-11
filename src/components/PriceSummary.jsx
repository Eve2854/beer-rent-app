import React from 'react';

const PriceSummary = ({ precioTotal, onConfirm }) => (
  <div className="summary-card">
    <h2 className="price-display">${precioTotal.toLocaleString('es-AR')}</h2>
    <button onClick={onConfirm} className="btn-confirm">
      SOLICITAR RESERVA 🍺
    </button>
  </div>
);

export default PriceSummary;