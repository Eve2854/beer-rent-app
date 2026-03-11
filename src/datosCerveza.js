export const productos = {
  cerveza: [
    { id: 1, litros: 10, precio: 30000 },
    { id: 2, litros: 20, precio: 60000 },
    { id: 3, litros: 30, precio: 90000 },
    { id: 4, litros: 50, precio: 150000 },
  ],
  gin: [
    { id: 5, litros: 10, precio: 39000 },
    { id: 6, litros: 20, precio: 78000 },
    { id: 7, litros: 30, precio: 117000 },
    { id: 8, litros: 50, precio: 195000 },
  ],
  serviciosEvento: [
    { id: 'solo_cerveza', nombre: 'Solo Cerveza', precioPersona: 9000, desc: 'Alquiler de carro cervecero.' },
    { id: 'barra_simple', nombre: 'Cerveza + Barra Simple', precioPersona: 12000, desc: 'Incluye Gancia, Fernet y Gin.' },
    { id: 'barra_premium', nombre: 'Cerveza + Barra Premium', precioPersona: 15000, desc: '5 tragos a elección: Fernet, Gancia, Gin, Don Pedro, Daikiri, Mojito, Cuba Libre o Destornillador.' }
  ]
};