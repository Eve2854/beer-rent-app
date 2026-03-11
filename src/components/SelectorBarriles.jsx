import React from 'react';
import { opcionesBarriles } from '../datosCerveza';

const SelectorBarriles = ({ litrosSeleccionados, setLitrosSeleccionados }) => {
  return (
    <div className="selector-container">
      <h2>1. Elegí el tamaño del barril</h2>
      <div className="opciones-grid">
        {opcionesBarriles.map((barril) => (
          <button
            key={barril.id}
            className={`card-barril ${litrosSeleccionados === barril.litros ? 'active' : ''}`}
            onClick={() => setLitrosSeleccionados(