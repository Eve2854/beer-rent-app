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

        <div className="footer-terms">
          <details>
            <summary>Terminos y Condiciones del Servicio</summary>
            <div className="terms-body">
              <p><b>MOND Cerveza Artesanal</b></p>
              <p>Ultima actualizacion: Marzo 2026</p>
              <p>La contratacion de cualquiera de los servicios ofrecidos por MOND Cerveza Artesanal implica la aceptacion total de los presentes terminos y condiciones.</p>
              <p><b>1. Objeto del servicio</b></p>
              <p>MOND Cerveza Artesanal ofrece servicios de provision de cerveza artesanal para eventos mediante el alquiler de barriles y sistemas de despacho, incluyendo barras cerveceras, equipos de servicio o carro cervecero. El servicio puede incluir el prestamo temporal del equipamiento necesario para el despacho de la cerveza durante el evento.</p>
              <p><b>2. Propiedad del equipamiento</b></p>
              <p>Todo el equipamiento entregado es propiedad exclusiva de MOND Cerveza Artesanal y se entrega al cliente unicamente en caracter de prestamo o alquiler temporal. Bajo ningun concepto el equipamiento pasa a ser propiedad del cliente.</p>
              <p><b>3. Equipamiento entregado</b></p>
              <p>Dependiendo del servicio contratado, el equipamiento puede incluir total o parcialmente los siguientes elementos:</p>
              <p>Barriles de cerveza de acero inoxidable; Conectores de barril; Mangueras de cerveza y gas; Party pump (bomba manual de cerveza); Fraperas o sistemas de enfriamiento; Pilon cervecero; Canillas de acero inoxidable; Desagotes de acero inoxidable; Infladores; Barra cervecera; Carro cervecero; Barriles instalados en el carro; Manometros; Tubo de CO2; Regulador primario de gas; Reguladores secundarios de gas; Sistema de iluminacion del carro; Instalacion interna del carro cervecero; Accesorios tecnicos necesarios para el funcionamiento del sistema de despacho.</p>
              <p><b>4. Responsabilidad del cliente</b></p>
              <p>Desde el momento de la entrega del equipamiento hasta su retiro por parte de MOND Cerveza Artesanal, el cliente asume la responsabilidad total por el cuidado, resguardo y uso adecuado de todos los elementos entregados. El cliente se compromete a devolver todos los equipos en las mismas condiciones en que fueron entregados, salvo el desgaste normal por uso correcto.</p>
              <p><b>5. Danos, perdidas o faltantes</b></p>
              <p>El cliente sera responsable por cualquier dano, rotura, perdida, faltante o robo total o parcial del equipamiento entregado. En caso de que ocurra cualquiera de estas situaciones, el cliente debera abonar el costo total de reparacion o reposicion del elemento afectado segun los valores vigentes establecidos por MOND Cerveza Artesanal.</p>
              <p><b>6. Valores de reposicion de referencia</b></p>
              <p>Barril de acero inoxidable → USD 150; Conector de barril → USD 90; Party pump → USD 120; Tubo de CO2 → USD 180; Regulador primario → USD 120; Regulador secundario → USD 70; Canilla de acero inoxidable → USD 60; Pilon cervecero → USD 250; Mangueras de cerveza o gas → USD 30; Frapera → USD 60; Barra cervecera → USD 300; Sistema de iluminacion → USD 80; Carro cervecero completo → valor a cotizar segun danos.</p>
              <p>Los valores podran actualizarse sin previo aviso en funcion del costo de reposicion del equipamiento.</p>
              <p><b>7. Manipulacion del sistema</b></p>
              <p>Queda prohibido desmontar, modificar o manipular reguladores de gas, manometros, conexiones, mangueras o cualquier componente tecnico del sistema de despacho. Cualquier dano ocasionado por manipulacion indebida sera responsabilidad exclusiva del cliente.</p>
              <p><b>8. Ubicacion y seguridad del equipamiento</b></p>
              <p>El cliente debera garantizar que el equipamiento permanezca en un lugar seguro durante todo el evento, evitando golpes, caidas, manipulacion indebida por terceros o cualquier situacion que pueda provocar danos.</p>
              <p><b>9. Deposito en garantia</b></p>
              <p>MOND Cerveza Artesanal podra solicitar un deposito en garantia por el equipamiento entregado. Dicho deposito sera reintegrado una vez verificado el correcto estado y devolucion completa de todos los elementos. En caso de danos, roturas o faltantes, el costo correspondiente sera descontado del deposito.</p>
              <p><b>10. Acceso para retiro del equipamiento</b></p>
              <p>El cliente debera garantizar el acceso al lugar del evento para el retiro del equipamiento en el horario previamente acordado.</p>
              <p><b>11. Cancelaciones</b></p>
              <p>Las condiciones de cancelacion o modificacion del servicio seran informadas al momento de realizar la contratacion.</p>
              <p><b>12. Devolucion de barriles</b></p>
              <p>Los barriles de cerveza entregados en el servicio son envases retornables y propiedad exclusiva de MOND Cerveza Artesanal. El cliente se compromete a devolver todos los barriles entregados una vez finalizado el evento, independientemente de que se encuentren vacios o con contenido restante.</p>
              <p>En caso de perdida, no devolucion, dano estructural o inutilizacion de un barril, el cliente debera abonar el valor total de reposicion correspondiente. A modo de referencia, el valor de reposicion de un barril de acero inoxidable es de USD 150 por unidad. MOND Cerveza Artesanal se reserva el derecho de actualizar este valor de acuerdo al costo de reposicion del equipamiento.</p>
              <p><b>13. Aceptacion de los terminos</b></p>
              <p>La contratacion del servicio, el pago de la sena o reserva, o la confirmacion del pedido por cualquier medio implica la aceptacion total de los presentes terminos y condiciones.</p>
              <p><b>MonD Cerveza Artesanal</b></p>
              <p>Servicio de cerveza artesanal para eventos.</p>
            </div>
          </details>
        </div>
        <div className="footer-copy">© MOND Cerveza Artesanal 2026</div>
      </div>
    </footer>
  );
};

export default Footer;
