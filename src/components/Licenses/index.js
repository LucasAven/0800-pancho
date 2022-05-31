import Title from "components/Title";

const Licenses = ({ prices }) => {
  return (
    <section className="license-section sections-shadow">
      <Title title="Licencias" backgroudColor="transparent" isAbsolute />
      <div className="license-container">
        <div className="license">
          <h3 className="license__title">
            Licencia <br /> Básica
          </h3>
          <h4 className="license__price">ARS ${prices.basic}</h4>
          <ul className="license__perks-container">
            <li>Archivo WAV y MP3</li>
            <li>Sin Tag o marca de agua</li>
            <li>Conservas el 100% de las regalías</li>
            <li>Distribución libre en cualquier plataforma</li>
          </ul>
          <p className="license__delivery-time">🕓 Entrega inmediata</p>
        </div>
        <div className="license">
          <h3 className="license__title">
            Licencia <br /> premium
          </h3>
          <h4 className="license__price">ARS ${prices.premium}</h4>
          <ul className="license__perks-container">
            <li>Archivo WAV y MP3</li>
            <li>Sin Tag o marca de agua</li>
            <li>Conservas el 100% de las regalías</li>
            <li>Distribución libre en cualquier plataforma</li>
            <li>
              Entrega de archivos Stems del Beat (todos los sonidos utilizados
              por separado)
            </li>
          </ul>
          <p className="license__delivery-time">🕓 Entrega inmediata</p>
        </div>
        <div className="license license--custom">
          <h3 className="license__title">
            Beat <br /> personalizado
          </h3>
          <h4 className="license__price">ARS ${prices.custom}</h4>
          <p className="license__custom-beat-description">
            Creacion de un beat a gusto, nos ponemos en contacto y llegamos al
            resultado deseado.
          </p>
          <ul className="license__perks-container">
            <li>Archivo WAV y MP3</li>
            <li>Sin Tag o marca de agua</li>
            <li>Conservas el 100% de las regalías</li>
            <li>Distribución libre en cualquier plataforma</li>
            <li>
              Entrega de archivos Stems del Beat (todos los sonidos utilizados
              por separado)
            </li>
            <li>Podes enviar tu beat o canción de referencia</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Licenses;
