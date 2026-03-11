# Beer Rent App

Cotizador de alquiler de barriles y servicio para eventos.

## Requisitos

- Node.js 20+
- npm 10+

## Scripts

- `npm run dev`: inicia el entorno de desarrollo
- `npm run build`: compila para producción
- `npm run preview`: previsualiza el build
- `npm run lint`: valida estilo y reglas de React Hooks

## Reglas de negocio actuales

- En modalidad **eventos** el mínimo es de **50 personas**.
- Se calcula automáticamente una **seña del 30%** al confirmar el pedido.
- Para barriles, el total depende de:
  - tipo de bebida,
  - litros,
  - hielo opcional,
  - tipo de equipo.

## Estructura principal

- `src/App.jsx`: pantalla principal y flujo de reserva.
- `src/datosCerveza.js`: catálogo de productos y servicios.
- `src/App.css`: estilos principales de la aplicación.

## Próximas mejoras sugeridas

- Separar `App.jsx` en componentes (`Header`, `FormularioReserva`, `ResumenPrecio`, etc.).
- Mover utilidades de cálculo y armado de mensaje a `src/utils/`.
- Agregar tests de lógica para precios y validaciones.
