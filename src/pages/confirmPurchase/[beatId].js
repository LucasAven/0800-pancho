import NoteSVG from "components/svgs/NoteSVG";
import ClockSVG from "components/svgs/ClockSVG";
import Title from "components/Title";
import { get, getDatabase, ref } from "firebase/database";
import Image from "next/image";
import { firebaseApp } from "utils/firebase";
import BpmSVG from "components/svgs/BpmSVG";
import { useForm } from "react-hook-form";
import Input from "components/ContactForm/Input";
import { useState } from "react";
import styled from "@emotion/styled";
import Select from "react-dropdown-select";
import MP from "../../config/mercadopago";
import { useRouter } from "next/router";

const options = [
  { label: "Licencia Básica", value: "basic" },
  { label: "Licencia Premium", value: "premium" },
];

const confirmPurchase = ({ beat, basic, premium }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const [license, setLicence] = useState("basic");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const onSubmit = (data) => {
    setLoading(true);
    const purchaseData = {
      item: {
        id: beat.key,
        title: `${beat.titulo} licencia ${license}`,
        description: `Compra de la licencia ${license} del beat: ${beat.titulo}`,
        quantity: 1,
        // unit_price: license === "basic" ? basic : premium,
        unit_price: 5,
        picture_url: beat.url_imagen,
      },
      customer: data.email,
      license: license,
    };
    MP.confirmPurchase(purchaseData)
      .then((url) => navigate.push(url.data.link))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };
  return (
    <section style={{ minHeight: "calc(100vh - 182px)" }}>
      <Title title="completar compra" />
      <div className="beat__container">
        <Image
          src={beat.url_imagen}
          alt={beat.titulo}
          width={250}
          height={160}
          layout="fixed"
        />
        <div className="beat__info-container">
          <h2>{beat.titulo}</h2>
          <div className="beat__info-metaData">
            <div>
              <ClockSVG width="20px" height="20px" fill="#ffffff" />{" "}
              <p>{beat.duracion}</p>
            </div>
            <div>
              <BpmSVG width="20px" height="20px" fill="#ffffff" />{" "}
              <p>{beat.bpm}</p>
            </div>
            <div>
              <NoteSVG width="20px" height="20px" fill="#ffffff" />
              <p>{beat.escala}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="purchase__data">
        <form onSubmit={handleSubmit(onSubmit)} className="purchase__form">
          <Input
            type="email"
            name="email"
            placeholder="Email (recibirás los archivos en este email)"
            register={register}
            getValues={getValues}
            errors={errors}
            validations={{
              required: "Email requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email inválido",
              },
            }}
          />
          <StyledSelect
            className="contact__input-container"
            name="license"
            options={options}
            values={[options[0]]}
            color="#eee"
            dropdownGap={0}
            searchable={false}
            onChange={(opt) => setLicence(opt[0].value)}
          />
          <div className="beat__price-container">
            <p>Incluye:</p>
            <ul className="license__perks-container">
              <li>Archivo WAV y MP3</li>
              <li>Sin Tag o marca de agua</li>
              <li>Conservas el 100% de las regalías</li>
              <li>Distribución libre en cualquier plataforma</li>
              {license === "premium" && (
                <li>
                  Entrega de archivos Stems del Beat (todos los sonidos
                  utilizados por separado)
                </li>
              )}
            </ul>
            <div className="beat__price__values">
              <h3>Precio final: ${license === "basic" ? basic : premium}</h3>
              <button
                type="submit"
                className="beat__action-btn"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="loader"
                    style={{ position: "static", padding: 3 }}
                  ></div>
                ) : (
                  "Comprar"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

const StyledSelect = styled(Select)`
  background: #b38325;
  border: none;
  ${"" /* width: clamp(80px, 100%, 250px); */}
  margin: 0 auto;
  padding: 2px 20px;
  color: #eee;

  :focus,
  :focus-within {
    box-shadow: 0px 0 0 2px rgb(238 238 14 / 20%);
  }
  .react-dropdown-select-content {
    flex-wrap: nowrap;
  }
  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: #fff;
  }
  .react-dropdown-select-option {
    border: 1px solid #fff;
  }
  .react-dropdown-select-item {
    color: #eee;
  }
  .react-dropdown-select-input,
  .react-dropdown-select-input::placeholder {
    display: none;
    color: #eee;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
    width: 100%;
  }
  .react-dropdown-select-dropdown {
    position: absolute;
    width: 100%;
    top: 36px;
    border: none;
    padding: 0 0 5px;
    display: flex;
    flex-direction: column;
    border-radius: 2px 2px 20px 20px;
    max-height: 300px;
    overflow: auto;
    z-index: 9;
    background: #b38325;
    box-shadow: none;
  }
  .react-dropdown-select-item {
    border-bottom: transparent;

    :hover {
      color: #000;
      background: #ffff0045;
    }
  }
  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    border-bottom: transparent;
    font-weight: bold;
    background: #ffb15d;
  }
  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: #b38325;
    color: #ccc;
  }
`;

confirmPurchase.getInitialProps = async ({ query }) => {
  const { beatId } = query;
  const database = getDatabase(firebaseApp);
  const beatRef = ref(database, `beats/${beatId}`);
  const beatRes = await get(beatRef);
  const beat = beatRes.val();
  const dbPreciosRef = ref(database, "prices/");
  const dbPreciosRes = await get(dbPreciosRef);
  let { basic, premium } = dbPreciosRes.val();
  let valorDolar = 200;
  fetch("https://api.bluelytics.com.ar/v2/latest")
    .then((response) => response.json())
    .then((data) => (valorDolar = Number(data.blue.value_sell)))
    .catch((error) => {
      console.log("Error al obtener valor del dolar: ", error);
    });
  basic = basic * valorDolar;
  premium = premium * valorDolar;
  return { beat, basic, premium };
};
export default confirmPurchase;
